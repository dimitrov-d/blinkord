import { ModalSubmitInteraction } from 'discord.js';
import { MongoDB } from '../database/mongo';
import { executeAction } from '../services/execute-action';

export async function actionModalExecute(interaction: ModalSubmitInteraction, mongoDB: MongoDB) {
  const [, index, url] = interaction.customId.split('_');

  const actionData = await mongoDB.getOrSetActionData(url);
  const action = actionData?.links?.actions[+index];
  if (!action) return `Action not found`;

  const params = action.parameters
    // Modals support max 5 components
    .slice(0, 5)
    .map((param) => {
      const value = interaction.fields.getTextInputValue(param.name);
      return { [param.name]: { type: param.type, value } };
    })
    .reduce((acc, param) => ({ ...acc, ...param }), {});

  for (const [name, { type, value }] of Object.entries(params)) {
    switch (type) {
      case 'number':
        if (isNaN(Number(value))) {
          return `Invalid value for ${name}: must be a number`;
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return `Invalid value for ${name}: must be a valid email`;
        }
        break;
      case 'url':
        try {
          new URL(value);
        } catch (_) {
          return `Invalid value for ${name}: must be a valid URL`;
        }
        break;
      case 'date':
      case 'datetime-local':
        if (isNaN(Date.parse(value))) {
          return `Invalid value for ${name}: must be a valid date`;
        }
        break;
    }
    action.href = action.href.replace(`{${name}}`, encodeURIComponent(value));
  }

  return await executeAction(interaction, action, url, mongoDB);
}

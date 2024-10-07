import { ModalSubmitInteraction } from 'discord.js';
import { MongoDB } from '../database/mongo';
import { executeAction } from '../services/execute-action';

export async function actionModalExecute(interaction: ModalSubmitInteraction, mongoDB: MongoDB) {
  const [, index, url] = interaction.customId.split('_');

  const actionData = await mongoDB.getOrSetActionData(url);
  const action = actionData?.links?.actions[+index];
  if (!action) return `Action not found`;

  const params: Record<string, string> = {};
  action.parameters?.forEach((param) => {
    params[param.name] = interaction.fields.getTextInputValue(param.name);
  });

  for (const [key, value] of Object.entries(params)) {
    action.href = action.href.replace(`{${key}}`, encodeURIComponent(value));
  }

  return await executeAction(interaction, action);
}

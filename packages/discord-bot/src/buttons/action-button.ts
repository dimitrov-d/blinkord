import { ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import { MongoDB } from '../database/mongo';
import { getUserWallet } from '../database/database';
import { getWalletBalance } from '../services/solana';
import { executeAction } from '../services/execute-action';
import { LinkedAction } from '../types/types';

export async function actionButtonExecute(interaction: ButtonInteraction, mongoDB: MongoDB) {
  const customId = interaction.customId;
  const [, index, urlHash, hasParams] = customId.split('_');

  // Defer the interaction if there are no parameters, otherwise show the modal
  if (hasParams && hasParams === 'false' && !interaction.deferred) await interaction.deferReply({ ephemeral: true });

  // Get the user's wallet from the database
  const wallet = await getUserWallet(interaction.user.id);
  if (!wallet) return 'No wallet found, run `/start` to get started.';

  const balance = await getWalletBalance(wallet.address);
  if (!balance) return 'Your wallet balance is empty, run `/start` to get started.';

  const actionData = await mongoDB.getOrSetActionData(urlHash);
  if (!actionData) return 'Action not found';

  let action = actionData?.links?.actions[+index] as LinkedAction;
  if (!action) action = { href: actionData.url, ...actionData };

  if (!action.parameters?.length) {
    if (!interaction.deferred) await interaction.deferReply({ ephemeral: true });
    return await executeAction(interaction, action, actionData.url);
  }

  // Handle parameters in a modal
  return new ModalBuilder()
    .setCustomId(`action_${index}_${urlHash}`)
    .setTitle(action.label)
    .addComponents(
      // Modals support max 5 components
      ...action.parameters.slice(0, 5).map((param) => {
        const input = new TextInputBuilder()
          .setCustomId(param.name)
          .setLabel(
            `${param.label || param.name} ${param.options?.length ? `(${param.options.map((option) => option.label).join(', ')})` : ''}`,
          )
          .setStyle(TextInputStyle.Short)
          .setRequired(param.required);

        let placeholder = param.patternDescription || '';

        if (param.min || param.max) {
          const minMaxDescription = `Min: ${param.min || 'N/A'}, Max: ${param.max || 'N/A'}`;
          placeholder += ` ${minMaxDescription}`;
        }

        if (param.type === 'select' || param.type === 'radio') {
          const options = param.options.map((option) => option.value).join(', ');
          placeholder += ` Options: ${options}`;
        }

        input.setPlaceholder(placeholder.trim());

        return new ActionRowBuilder<TextInputBuilder>().addComponents(input);
      }),
    );
}

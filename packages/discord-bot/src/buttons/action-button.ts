import { ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import { MongoDB } from '../database/mongo';
import { getUserWallet } from '../database/database';
import { getWalletBalance } from '../services/solana';
import { executeAction } from '../services/execute-action';
import { Action, LinkedAction } from '../types/types';

export async function actionButtonExecute(interaction: ButtonInteraction, mongoDB: MongoDB) {
  // Get the user's wallet from the database
  const wallet = await getUserWallet(interaction.user.id);
  if (!wallet) return 'No wallet found, run `/start` to get started.';

  const balance = await getWalletBalance(wallet.address);
  if (!balance) return 'Your wallet balance is empty, run `/start` to get started.';

  const customId = interaction.customId;
  const [, index, url] = customId.split('_');

  const actionData = (await mongoDB.getOrSetActionData(url)) as Action;
  if (!actionData) return 'Action not found';

  let action = actionData?.links?.actions[+index] as LinkedAction;
  if (!action) action = { href: url, ...actionData };

  if (!action.parameters?.length) {
    if (!interaction.deferred) await interaction.deferReply({ ephemeral: true });
    return await executeAction(interaction, action);
  }

  // If there are parameters, show the modal
  return new ModalBuilder()
    .setCustomId(`action_${index}_${url}`)
    .setTitle(action.label)
    .addComponents(
      ...action.parameters.map((param) => {
        const input = new TextInputBuilder()
          .setCustomId(param.name)
          .setLabel(param.label)
          .setStyle(TextInputStyle.Short)
          .setRequired(param.required);
        return new ActionRowBuilder<TextInputBuilder>().addComponents(input);
      }),
    );
}

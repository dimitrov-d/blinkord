import axios from 'axios';
import { ButtonInteraction, InteractionReplyOptions, ModalSubmitInteraction } from 'discord.js';
import { getUserWallet } from '../database/database';
import { LinkedAction } from '../types/types';
import { executeTransaction } from './solana';
import { addBlinkordRole, createActionEmbed } from './discord';

export async function executeAction(
  interaction: ButtonInteraction | ModalSubmitInteraction,
  action: LinkedAction,
  actionUrl: string,
): Promise<InteractionReplyOptions | string> {
  // Get the user's wallet from the database
  const wallet = await getUserWallet(interaction.user.id);
  if (!wallet) return 'No wallet found, run `/start` to get started.';
  // Check if the action is a Blinkord role purchase
  const blinkordRegex = /^https:\/\/api\.blinkord\.com\/blinks\/(\d{17,19})\/buy\?roleId=(\d{17,19})/;
  const match = action.href.match(blinkordRegex);
  const [guildId, roleId] = [match?.[1], match?.[2]];

  try {
    const body = { account: wallet.address } as any;
    if (guildId && roleId) body.isDiscordBot = true;
    const {
      data: { transaction, message, error, links },
    } = await axios.post(action.href, body);

    if (error) return `❌ Error: ${error}`;

    const signature = transaction ? await executeTransaction(transaction, wallet) : undefined;
    const content = `✅ Success\n${message || ''}\n${signature ? `Transaction: https://solscan.io/tx/${signature}` : ''}`;

    // Blinkord only
    if (guildId && roleId) addBlinkordRole(guildId, roleId, interaction.user.id);
    // Handle action chaining
    else if (links?.next) {
      const { type, action: nextAction, href } = links.next;
      if (type === 'inline' && nextAction) {
        return { content, ...createActionEmbed(nextAction, href || actionUrl) };
      } else if (type === 'post' && href) {
        const { data: nextActionData } = await axios.post(href, { ...body, signature });
        return { content, ...createActionEmbed(nextActionData, href) };
      }
    }

    return content;
  } catch (error: any) {
    if (error?.name === 'TransactionFailedError') return error.message;

    console.error(`Error executing action: ${error}`);
    return error?.response?.data?.message || error?.response?.data || 'An error occurred, please try again later';
  }
}

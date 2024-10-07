import { ButtonInteraction, ChatInputCommandInteraction } from 'discord.js';
import { getUserWallet } from '../database/database';
import { decryptText } from '../services/crypto';

export async function exportWallet(interaction: ChatInputCommandInteraction | ButtonInteraction): Promise<string> {
  const wallet = await getUserWallet(interaction.user.id);
  if (!wallet) return 'No wallet found, run `/start` to get started.';

  return `Your wallet private key: \`\`\`${await decryptText(wallet.privateKey)}\`\`\``;
}

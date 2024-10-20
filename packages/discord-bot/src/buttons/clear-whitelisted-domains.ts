import { ButtonInteraction } from 'discord.js';
import { modifyWhitelistedDomains } from '../database/database';
import { whitelistedDomains } from '../commands/whitelisted-domains';

export async function clearWhitelistedDomains(interaction: ButtonInteraction) {
  await modifyWhitelistedDomains(interaction.guildId, null);
  return {
    ...(await whitelistedDomains(interaction)),
    content: '✅ Whitelisted domains cleared successfully.',
  };
}

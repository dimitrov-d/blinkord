import { ModalSubmitInteraction } from 'discord.js';
import { modifyWhitelistedDomains } from '../database/database';
import { whitelistedDomains } from '../commands/whitelisted-domains';

export async function modifyWhitelistedDomainsExecute(interaction: ModalSubmitInteraction) {
  const domains = interaction.fields.getTextInputValue('whitelistedDomainsInput');
  if (!domains) return '❌ Invalid domains provided.';

  const domainPattern = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;

  if (
    domains
      .split(',')
      .map((domain) => domain.trim())
      .filter((domain) => !domainPattern.test(domain)).length > 0
  )
    return '❌ Invalid domains provided.';

  await modifyWhitelistedDomains(interaction.guildId, domains);
  return {
    ...(await whitelistedDomains(interaction)),
    content: '✅ Whitelisted domains updated successfully.',
  };
}

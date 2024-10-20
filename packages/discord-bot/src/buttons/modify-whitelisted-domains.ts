import { ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

export async function modifyWhitelistedDomains() {
  return new ModalBuilder()
    .setCustomId('whitelistedDomainsModal')
    .setTitle('Modify Whitelisted Domains')
    .addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId('whitelistedDomainsInput')
          .setLabel('Enter domains (comma separated if multiple)')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('blinkord.com,discord.com')
          .setRequired(true),
      ),
    );
}

import {
  ChatInputCommandInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
  ModalSubmitInteraction,
  ButtonInteraction,
} from 'discord.js';
import { getBotGuild } from '../database/database';

export async function whitelistedDomains(
  interaction: ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction,
) {
  const botGuild = await getBotGuild(interaction.guildId);

  if (!botGuild) {
    return { content: 'Bot guild not found.' };
  }

  const embed = new EmbedBuilder()
    .setTitle(`Whitelisted Domains for ${botGuild.name}`)
    .setDescription(
      botGuild.whitelistedDomains
        ? `Whitelisted Domains: ${botGuild.whitelistedDomains}`
        : 'No whitelisted domains set.',
    )
    .setColor('Blue');

  const modifyButton = new ButtonBuilder()
    .setCustomId('modifyWhitelistedDomains')
    .setLabel('Modify')
    .setStyle(ButtonStyle.Primary);

  const clearButton = new ButtonBuilder()
    .setCustomId('clearWhitelistedDomains')
    .setLabel('Clear')
    .setStyle(ButtonStyle.Danger);

  const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(modifyButton, clearButton);

  return { embeds: [embed], components: [actionRow] };
}

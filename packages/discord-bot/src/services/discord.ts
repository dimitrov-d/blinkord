import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  TextChannel,
} from 'discord.js';
import { Action, LinkedAction } from '../types/types';
import { toDataURL } from 'qrcode';
import { constants } from '../constants';
import axios from 'axios';
import { hash } from './crypto';

export function createActionEmbed(action: Action, url: string) {
  const embed = new EmbedBuilder()
    .setTitle(action.title || 'Action')
    .setURL(new URL(url).origin)
    .setDescription(action.description || '\u200B')
    .setImage(action.icon || '\u200B')
    .setColor('Random');

  const components = createEmbedComponents(action, url);
  return { embeds: [embed], components };
}
export function createEmbedComponents(action: Action, url: string): ActionRowBuilder<ButtonBuilder>[] {
  const actionRow = new ActionRowBuilder<ButtonBuilder>();

  if (action.links?.actions?.length) {
    actionRow.addComponents(
      ...action.links.actions.map((action: LinkedAction, index: number) =>
        new ButtonBuilder()
          .setCustomId(`action_${index}_${hash(url)}_${!!action.parameters?.length}`)
          .setLabel(action.label)
          .setStyle(ButtonStyle.Primary),
      ),
    );
  } else if (action.label) {
    actionRow.addComponents(
      new ButtonBuilder()
        .setCustomId(`action_0_${hash(url)}_false`)
        .setLabel(action.label)
        .setStyle(ButtonStyle.Primary),
    );
  }

  return actionRow.components.length ? [actionRow] : [];
}

export async function getQrCodeUrl(walletAddress: string, interaction: ChatInputCommandInteraction) {
  const qrCodeAttachment = new AttachmentBuilder(
    Buffer.from((await toDataURL(walletAddress)).split(',')[1], 'base64'),
    { name: 'qrcode.png' },
  );
  const qrCodeChannel = (await interaction.client.channels.fetch(constants.qrCodeChannelId)) as TextChannel;
  const qrCodeMessage = await qrCodeChannel.send({ files: [qrCodeAttachment] });
  return qrCodeMessage.attachments.first().url;
}

export async function addBlinkordRole(guildId: string, roleId: string, discordUserId: string) {
  try {
    await axios.put(
      `https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}/roles/${roleId}`,
      {},
      { headers: { Authorization: `Bot ${constants.botToken}` } },
    );
  } catch (err) {
    console.error(`Error adding role to user: ${err}`);
  }
}

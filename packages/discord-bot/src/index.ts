import 'dotenv/config';
require('console-stamp')(console, 'dd/mm/yyyy HH:MM:ss');
import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
  InteractionReplyOptions,
  ModalBuilder,
  ModalSubmitInteraction,
  Partials,
} from 'discord.js';
import { constants } from './constants';
import { isTrusted } from './services/registry';
import { MongoDB } from './database/mongo';
import { createActionEmbed, createEmbedComponents } from './services/discord';
import { initializeDatabase } from './database/database';
import { exportWallet } from './commands/export';
import { openWithdrawSolModal, withdrawSolFromWallet } from './buttons/withdraw';
import { start } from './commands/start';
import { actionButtonExecute } from './buttons/action-button';
import { actionModalExecute } from './modals/action-modal';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Message, Partials.Channel],
});

client.login(constants.botToken);
const mongoDB = new MongoDB();

client.on(Events.ClientReady, async () => {
  const guild = client.guilds.cache.get(constants.guildId);
  await Promise.all([client.application?.fetch(), mongoDB.connect(), initializeDatabase()]);

  console.info(`${client.user.username} is running on ${guild.name}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !/(https?:\/\/[^\s]+)/g.test(message.content)) return;

  const url = message.content.match(/(https?:\/\/[^\s]+)/g)[0];

  try {
    const { origin } = new URL(url);
    if (!(await isTrusted(origin))) return;

    const actionData = await mongoDB.getOrSetActionData(url);
    if (!actionData) return;

    // await message.delete();
    await message.suppressEmbeds(true)?.catch(() => {});
    message.reply(createActionEmbed(actionData, url));
  } catch (error) {
    console.error(`Error unfurling blink for ${url}: ${error}`);
  }
});

// Slash commands
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const subcommandName = interaction.options.getSubcommand();

  try {
    console.info(`User: ${interaction.user.id} used the Command: ${subcommandName} on Server: ${interaction.guildId} `);
    await interaction.deferReply({ ephemeral: true });

    const content = await getCommandResult(interaction);
    await interaction.editReply(content);
  } catch (err) {
    console.error(`An error occurred while executing command ${interaction.options.getSubcommand()}: ${err}`);
    await interaction.editReply('Sorry, something went wrong! Please try again later.');
  }
});

// Button Click
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  try {
    const content = await getButtonResult(interaction);

    if (content instanceof ModalBuilder) return await interaction.showModal(content);
    if (!interaction.deferred) await interaction.deferReply({ ephemeral: true });

    await interaction.editReply(content);
  } catch (error) {
    console.error(`Error occured while processing the button ${interaction.customId}: `, error.message);
    await interaction[interaction.deferred ? 'editReply' : 'reply'](
      'Sorry, something went wrong! Please try again later.',
    );
  }
});

// Modal Submit
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;
  try {
    await interaction.deferReply({ ephemeral: true });
    const content = await getModalResult(interaction);

    await interaction.editReply(content);
  } catch (error) {
    console.error(`Error occured while processing the modal: `, error.message);
    await interaction.editReply('Sorry, something went wrong! Please try again later.');
  }
});

export async function getCommandResult(
  interaction: ChatInputCommandInteraction,
): Promise<InteractionReplyOptions | string> {
  switch (interaction.options.getSubcommand()) {
    case 'start':
      return start(interaction);
    case 'export':
      return exportWallet(interaction);
    default:
      const embed = new EmbedBuilder().setDescription('❌ Please enter a valid command.');
      return { embeds: [embed] };
  }
}

async function getButtonResult(
  interaction: ButtonInteraction,
): Promise<InteractionReplyOptions | string | ModalBuilder> {
  const [buttonType] = interaction.customId.split('_');
  switch (buttonType) {
    case 'action':
      return actionButtonExecute(interaction, mongoDB);
    case 'withdraw':
      return openWithdrawSolModal();
    case 'export':
      return exportWallet(interaction);
    default:
      const embed = new EmbedBuilder().setColor('Red').setDescription('❌ Invalid interaction');
      return { embeds: [embed] };
  }
}

async function getModalResult(interaction: ModalSubmitInteraction) {
  const [modalType] = interaction.customId.split('_');
  switch (modalType) {
    case 'withdrawSolModal':
      return withdrawSolFromWallet(interaction);
    case 'action':
      return actionModalExecute(interaction, mongoDB);
    default:
      const embed = new EmbedBuilder().setColor('Red').setDescription('❌ Invalid interaction');
      return { embeds: [embed] };
  }
}

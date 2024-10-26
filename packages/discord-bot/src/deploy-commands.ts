require('dotenv').config();
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { constants } from './constants';
import { ContextMenuCommandBuilder, ApplicationCommandType } from 'discord.js';

const applicationCommandsArray = [
  new SlashCommandBuilder()
    .setName('blinkord')
    .setDescription('Blinkord commands')
    .addSubcommand((subcommand) => subcommand.setName('start').setDescription('Get started with Blinkord bot'))

    .addSubcommand((subcommand) =>
      subcommand.setName('export').setDescription('Export the private keys to your wallet'),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('info').setDescription('Display information about the Blinkord Bot'),
    ),

  new SlashCommandBuilder()
    .setName('whitelisted-domains')
    .setDescription('View and modify the whitelisted domains for your server')
    .setDefaultMemberPermissions(0), // admin-only

  new ContextMenuCommandBuilder().setName('Refresh Action Data').setType(ApplicationCommandType.Message),
];

const guildCommandsArray = [
  // new SlashCommandBuilder()
  //   .setName('clear-cache')
  //   .setDescription('Clear the bot cache (Admin only)')
  //   .setDefaultMemberPermissions(0),
];

const applicationCommands = applicationCommandsArray.map((command) => command.toJSON());
const guildCommands = guildCommandsArray.map((command) => command.toJSON());

// Hack solution for user installable apps, since not yet supported on the SDK
(applicationCommands[0] as any).integration_types = [0, 1];
(applicationCommands[0] as any).contexts = [0, 1, 2];

const rest = new REST().setToken(constants.botToken);

rest
  .put(Routes.applicationCommands(constants.applicationId), { body: applicationCommands })
  .then(() => console.info(`-----Successfully registered application commands`))
  .catch((err) => console.error(`-----Error registering application commands: ${err}`));

rest
  .put(Routes.applicationGuildCommands(constants.applicationId, constants.guildId), { body: guildCommands })
  .then(() => console.info(`-----Successfully registered guild commands`))
  .catch((err) => console.error(`-----Error registering guild commands: ${err}`));

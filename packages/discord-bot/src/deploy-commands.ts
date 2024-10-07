require('dotenv').config();
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { constants } from './constants';

const applicationId = constants.applicationId;

const commandsArray = [
  new SlashCommandBuilder()
    .setName('blinkord')
    .setDescription('Blinkord commands')
    .addSubcommand((subcommand) => subcommand.setName('start').setDescription('Get started with Blinkord bot'))

    .addSubcommand((subcommand) =>
      subcommand.setName('export').setDescription('Export the private keys to your wallet'),
    ),
];

const commands = commandsArray.map((command) => command.toJSON());
// Hack solution for user instalable apps, since not yet supported on the SDK
(commands[0] as any).integration_types = [0, 1];
(commands[0] as any).contexts = [0, 1, 2];

new REST()
  .setToken(constants.botToken)
  // If you want these commands to be available to all guilds, then use Routes.applicationCommands
  .put(Routes.applicationGuildCommands(applicationId, constants.guildId), { body: commands })
  .then(() => console.info(`-----Successfully registered application commands`))
  .catch((err) => console.error(`-----Error registering application commands: ${err}`));

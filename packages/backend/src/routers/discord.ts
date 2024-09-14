import express, { Request, Response } from 'express';
import { findAllGuildIdsSortedByCreateTime, findGuildById, insertGuild, updateGuild } from '../database/database';
import { Guild } from '../database/entities/guild';
import env from '../services/env';
import { discordApi } from '../services/oauth';
import { verifySignature, verifyJwt } from '../middleware/auth';

export const discordRouter = express.Router();

/**
 * Gets all guilds from the database
 * @returns {Guild[]}
 */
discordRouter.get('/guilds', async (req: Request, res: Response) => {
  try {
    const guildIds = await findAllGuildIdsSortedByCreateTime();
    return res.json(guildIds);
  } catch (error) {
    console.error('Error fetching guild IDs', error);
    return res.status(500).json({ error: `Failed to get guilds: ${error}` });
  }
});

/**
 * Creates a new guild in the database
 * The wallet signature is verified to make the user is really the owner of that wallet.
 * @param {string} message - The message which was signed
 * @param {string} signature - The signature after signing the message
 * @param {string} address - The address from the connected wallet on the client
 * @param {Guild} data - The guild data which will be stored in the database
 * @returns {Guild}
 */
discordRouter.post('/guilds', [verifyJwt, verifySignature], async (req: Request, res: Response) => {
  const { address, data } = req.body;

  if (!data.name || !data.roles?.length) {
    return res.status(400).send({ error: 'Invalid guild data provided' });
  }
  data.address = address;
  console.info(`Going to create guild: ${JSON.stringify(data)}`);

  try {
    await insertGuild(new Guild(data));
    console.info(`Guild ${data.id} inserted successfully`);
    return res.status(201).json(data);
  } catch (error) {
    console.error('Error saving guild', error);
    return res.status(500).json({ error: `Failed to save guild and roles` });
  }
});

/**
 * Get a guild from the database
 * @param {string} guildId - Path parameter representing ID of the guild
 * @returns {Guild}
 */
discordRouter.get('/guilds/:guildId', verifyJwt, async (req: Request, res: Response) => {
  const guildId = req.params.guildId;

  const guild = await findGuildById(guildId);
  return res.json({ guild });
});

/**
 * Updates an existing guild in the database
 * @param {string} guildId - Path parameter representing ID of the guild
 * @param {string} message - The message which was signed
 * @param {string} signature - The signature after signing the message
 * @param {string} address - The address from the connected wallet on the client
 * @param {Guild} data - The guild data which will be stored in the database
 * @returns {Guild}
 */
discordRouter.put('/guilds/:guildId', [verifyJwt, verifySignature], async (req: Request, res: Response) => {
  const { address, data } = req.body;

  const guildId = req.params.guildId;

  const guild = await findGuildById(guildId);
  if (!guild) return res.status(404).send('Guild not found');

  data.address = address;

  console.info(`Going to update guild: ${JSON.stringify(data)}`);
  try {
    await updateGuild(guildId, data);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error updating guild', error);
    return res.status(500).json({ error: `Failed to update guild and roles` });
  }
});

/**
 * Get the roles of a guild through the API with Bot credentials
 * @param {string} guildId - Path parameter representing ID of the guild
 * @returns { blinkordRolePosition: number, roles: { id: string, name: string, position: number}[]}
 */
discordRouter.get('/guilds/:guildId/roles', async (req: Request, res: Response) => {
  try {
    const guildId = req.params.guildId;
    const { data: roles } = await discordApi.get(`/guilds/${guildId}/roles`, {
      headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
    });

    console.info(`Fetched ${roles.length} roles for guild ${guildId}`);

    const blinkordRolePosition = roles.find((r) => r.tags?.bot_id === env.DISCORD_CLIENT_ID)?.position;

    return res.json({
      roles: roles
        .filter((r) => !r.managed && r.name !== '@everyone')
        .sort((a, b) => b.position - a.position)
        .map(({ id, name, position }) => ({ id, name, position })),
      blinkordRolePosition,
    });
  } catch (error) {
    console.error('Error fetching server roles', error);
    res.status(500).json({ error: `Unable to get server roles: ${error}` });
  }
});

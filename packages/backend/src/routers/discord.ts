import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { findGuildById, insertGuild, saveNewAccessToken as saveAccessToken, updateGuild } from '../database/database';
import { Guild } from '../database/entities/guild';
import env from '../services/env';
import { discordApi, getDiscordAccessToken } from '../services/oauth';
import { verifySignature, verifyJwt } from '../middleware/auth';
import { AccessToken } from '../database/entities/access-token';
import { encryptText } from '../services/encrypt';

export const discordRouter = express.Router();

/**
 * Returns a Discord OAuth URL for logging in
 * @param {boolean} owner - If the login is done by a server owner or member, based on client-side context. Leave empty if not owner.
 * If it is an owner, the login scope is guilds, for members it is guilds.join
 * @returns { url: string }
 */
discordRouter.get('/login', (req: Request, res: Response) => {
  const clientId = env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(env.DISCORD_REDIRECT_URI);
  const isJoin = req.query.owner ? '' : '.join';
  return res.json({
    url: `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify+guilds${isJoin}`,
  });
});

/**
 * Callback after an owner has logged in. Returns a JWT token with the user's id, username, and guild IDs they are owner/admin of
 * @param {string} code - Query param with OAuth grant code provided after completing discord OAuth flow
 * @returns { token: string, userId: string, username: string, guilds: Guild[]}
 */
discordRouter.get('/login/callback', async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    const { access_token, expires_in } = await getDiscordAccessToken(code);
    console.info(`Login access token obtained, fetching user profile and guild data...`);

    const { data: user } = await discordApi.get('/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!req.query.owner) {
      // Save auth token for user flow, to avoid expiration of the grant code
      const expiresAt = new Date(Date.now() + expires_in * 1000);
      await saveAccessToken(
        new AccessToken({
          discordUserId: user.id,
          code,
          token: encryptText(access_token),
          expiresAt,
        }),
      );
      // No need to return response, redirect user to blink page
      return res.json({ success: true });
    }

    // Fetch the user's guilds
    const getGuilds = async (Authorization: string) => {
      const { data: guilds } = await discordApi.get('/users/@me/guilds', {
        headers: { Authorization },
      });
      return guilds;
    };

    // Guilds where the user is a member/owner
    const userGuilds = await getGuilds(`Bearer ${access_token}`);
    // Guilds the bot was invited into
    const botGuilds = await getGuilds(`Bot ${env.DISCORD_BOT_TOKEN}`);

    // Filter guilds where the user is the owner or admin
    const ownerOrAdminGuilds = userGuilds.filter((guild: any) => guild.owner || (guild.permissions & 0x8) === 0x8);

    const guildIds = ownerOrAdminGuilds.map((guild: any) => guild.id);

    console.info(`Successfully fetched user guilds, ${ownerOrAdminGuilds.length} in total.`);

    // Generate a JWT token for authentication
    const userId = user.id;
    const username = user.username;
    const token = jwt.sign({ userId, username, guildIds }, env.JWT_SECRET, { expiresIn: '1d' });

    // Return the token, user data and filtered guilds with info if bot is in
    return res.json({
      token,
      userId,
      username,
      guilds: ownerOrAdminGuilds.map(({ id, name, icon }) => ({
        id,
        name,
        image: icon ? `https://cdn.discordapp.com/icons/${id}/${icon}.png` : null,
        hasBot: botGuilds.some((g) => g.id === id),
      })),
    });
  } catch (err) {
    const error = `Error during OAuth callback: ${err}`;
    console.error(err);
    res.status(500).json({ error });
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

import express, { Request, Response } from 'express';
import { saveGuild, saveRole } from '../database/database';
import { Guild } from '../database/entities/guild';
import { Role } from '../database/entities/role';
import { verifySignature } from '../services/transaction';
import env from '../services/env';
import { discordApi, getDiscordAccessToken } from '../services/oauth';

export const discordRouter = express.Router();

/**
 * Returns a Discord OAuth URL for logging in
 * @param {boolean} owner - If the login is done by a server owner or member, based on client-side context
 * If it is an owner, the login scope is guilds, for members it is guilds.join
 */
discordRouter.get('/login', (req: Request, res: Response) =>
  res.json({
    url: `https://discord.com/oauth2/authorize?client_id=${env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(env.DISCORD_REDIRECT_URI)}&response_type=code&scope=identify guilds${req.query.owner ? '' : '.join'}&state=123`,
  }),
);

/**
 * Callback after an owner has logged in. Returns the user's id, username and guilds they are owner/admin of
 * @param {string} code - Query param with OAuth grant code provided after completing discord OAuth flow
 */
discordRouter.get('/login/callback', async (req: Request, res: Response) => {
  try {
    const accessToken = await getDiscordAccessToken(req.query.code as string);

    const { data: user } = await discordApi.get('/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    // Fetch the user's guilds
    const getGuilds = async (Authorization: string) => {
      const { data: guilds } = await discordApi.get('/users/@me/guilds', {
        headers: { Authorization },
      });
      return guilds;
    };

    // Guilds where the user is a member/owner
    const userGuilds = await getGuilds(`Bearer ${accessToken}`);
    // Guilds the bot was invited into
    const botGuilds = await getGuilds(`Bot ${env.DISCORD_BOT_TOKEN}`);

    // Filter guilds where the user is the owner or admin
    const ownerOrAdminGuilds = userGuilds.filter((guild: any) => guild.owner || (guild.permissions & 0x8) === 0x8);

    // Return the user data and filtered guilds with info if bot is in
    return res.json({
      userId: user.id,
      username: user.username,
      guilds: ownerOrAdminGuilds.map(({ id, name, icon }) => ({
        id,
        name,
        image: icon ? `https://cdn.discordapp.com/icons/${id}/${icon}.png` : null,
        hasBot: botGuilds.some((g) => g.id === id),
      })),
    });
  } catch (error) {
    console.error(`Error logging in with discord OAuth: ${error}`);
    res.status(500).json({ error: `Failed to authenticate with Discord: ${error}` });
  }
});

/**
 * Get the roles of a guild through the API with Bot credentials
 * @param {string} guildId - Path parameter representing ID of the guild
 */
discordRouter.get('/guilds/:guildId/roles', async (req: Request, res: Response) => {
  try {
    const { data: roles } = await discordApi.get(`/guilds/${req.params.guildId}/roles`, {
      headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
    });

    return res.json(roles.filter((r) => !r.managed && r.name !== '@everyone').map(({ id, name }) => ({ id, name })));
  } catch (error) {
    console.error(`Error fetching server roles: ${error}`);
    res.status(500).json({ error: `Unable to get server roles: ${error}` });
  }
});

/**
 * Creates a new guild in the database.
 * The wallet signature is verified to make the user is really the owner of that wallet.
 * @param {string} message - The message which was signed
 * @param {string} signature - The signature after signing the message
 * @param {string} address - The address from the connected wallet on the client
 * @param {Guild} guild - The guild data which will be stored in the database
 */
discordRouter.post('/guilds', async (req: Request, res: Response) => {
  const { message, signature, address, guild } = req.body as {
    message: string;
    signature: string;
    address: string;
    guild: Guild;
  };

  // Verify that the signature is valid, to prove that the user is truly owner of the payout wallet address
  if (!verifySignature(address, message, signature)) return res.status(401).send('Invalid signature');
  guild.address = address;

  try {
    await saveGuild(new Guild(guild));

    await Promise.all(guild.roles.map((role) => saveRole(new Role(role))));

    return res.status(201).json(guild);
  } catch (error) {
    console.error(`Error saving guild: ${error}`);
    return res.status(500).json({ message: `Failed to save guild and roles: ${error}` });
  }
});

import express, { Request, Response } from 'express';
import { Action } from '@solana/actions-spec';
import { actionCorsMiddleware, createPostResponse } from '@solana/actions';
import { generateSendTransaction } from '../services/transaction';
import env from '../services/env';
import { findGuildById } from '../database/database';
import { discordApi, getDiscordAccessToken } from '../services/oauth';
// import { BlinksightsClient } from 'blinksights-sdk';

export const apiRouter = express.Router();
apiRouter.use(actionCorsMiddleware({}));

const BASE_URL = env.APP_BASE_URL;
// const blinkSights = new BlinksightsClient(env.BLINKSIGHTS_API_KEY);

apiRouter.get('/', async (req: Request, res: Response) => res.json({
  type: 'completed',
  title: 'Use Blinkord',
  label: 'Go to https://blinkord.com',
  icon: `https://blinkord.com/banner.png`,
  description: 'Create shareable links for premium channels on your Discord server!',
}));
/**
 * Returns an action based on data for a given guild
 * @param {string} guildId - Path parameter representing ID of the guild
 * @param {string} code - Query param representing Discord OAuth code grant
 * @returns {[Action](https://docs.dialect.to/documentation/actions/actions/building-actions-with-nextjs#structuring-the-get-and-options-request)}
 */
apiRouter.get('/:guildId', async (req: Request, res: Response) => {
  const { guildId } = req.params;

  const guild = await findGuildById(guildId);
  if (!guild)
    return res.json({
      type: 'completed',
      links: { actions: [] },
      title: 'Not found',
      icon: 'https://agentestudio.com/uploads/post/image/69/main_how_to_design_404_page.png',
      description: 'Discord server not found',
    });

  console.info(`Sending action for guild ${guildId}`);

  const { code } = req.query;
  const payload: Action<'action'> = {
    type: 'action',
    label: null,
    title: guild.name,
    icon: guild.iconUrl,
    description: guild.description,
    links: {
      actions: guild.roles.map(({ id, name, amount }) => ({
        label: `${name} (${amount} SOL)`,
        href: `${BASE_URL}/api/${guildId}/buy?roleId=${id}&code=${code}`,
      })),
    },
    disabled: !code,
    error: code
      ? null
      : {
          message: `Discord login required, visit ${BASE_URL}/blinkord/${guildId}`,
        },
  };

  // Blinksights tracking API call fails
  // const response = blinkSights.createActionGetResponseV1(req.url, payload);
  // return res.json(response);
  return res.json(payload);
});

/**
 * Generates a transaction to send funds to the guild's wallet in order to obtain a role
 * @param {string} guildId - Path parameter representing ID of the guild
 * @param {string} code - Query param representing Discord OAuth code grant
 * @param {string} roleId - Query param representing the role that the user selected and wants to buy
 * @returns {[Action POST response](https://docs.dialect.to/documentation/actions/actions/building-actions-with-nextjs#structuring-the-get-and-options-request)}
 */
apiRouter.post('/:guildId/buy', async (req: Request, res: Response) => {
  const { code, roleId } = req.query;
  const { guildId } = req.params;

  if (!guildId || !roleId || !code)
    return res.status(400).json({
      error: `Invalid role purchase data: guildId=${guildId}, roleId=${roleId}`,
    });

  const guild = await findGuildById(guildId);
  if (!guild) return res.status(404).json({ error: 'Guild not found' });

  const role = guild.roles.find((r) => r.id === roleId);
  if (!role) return res.status(404).json({ error: 'Role not found' });

  try {
    const transaction = await generateSendTransaction(req.body.account, role.amount, guild);

    // blinkSights.trackActionV2(req.body.account, req.url);
    return res.json(
      await createPostResponse({
        fields: {
          transaction,
          message: `Buy role ${role.name} for ${role.amount} SOL`,
          links: {
            next: {
              type: 'post',
              href: `${BASE_URL}/api/${guildId}/confirm?roleId=${role.id}&code=${code}`,
            },
          },
        },
      }),
    );
  } catch (error) {
    console.error('Error during generating transaction', error);
    res.status(500).json({ error: `Error during generating transaction: ${error}` });
  }
});

/**
 * A subsequent endpoint called after purchase TX was confirmed
 * Uses Discord API to invite the user into a server and give them the role they bought
 * @param {string} guildId - Path parameter representing ID of the guild
 * @param {string} code - Query param representing Discord OAuth code grant
 * @param {string} roleId - Query param representing the role that the user bought successfully
 * @returns {[Completed action](https://docs.dialect.to/documentation/actions/specification/action-chaining)}
 */
apiRouter.post('/:guildId/confirm', express.text({ type: 'text/plain' }), async (req: Request, res: Response) => {
  // For some reason the subsequent `PostNextActionLink` sends the request with Content-Type text/plain
  req.body = JSON.parse(req.body);

  const { code, roleId } = req.query;
  const { guildId } = req.params;

  if (!guildId || !roleId || !code)
    return res.status(400).json({
      error: `Invalid role purchase data: guildId=${guildId}, roleId=${roleId}`,
    });

  const guild = await findGuildById(guildId);
  if (!guild) return res.status(404).json({ error: 'Guild not found' });

  const role = guild.roles.find((r) => r.id === roleId);
  if (!role) return res.status(404).json({ error: 'Role not found' });

  // Exchange the authorization code for an access token
  try {
    const access_token = await getDiscordAccessToken(code as string);
    console.info(`Guild join access token obtained, adding member to the server with roles...`);

    const { data: user } = await discordApi.get('/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    await discordApi.put(
      `/guilds/${guildId}/members/${user.id}`,
      { access_token, roles: [roleId] },
      { headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` } },
    );

    await discordApi.put(
      `/guilds/${guildId}/members/${user.id}/roles/${roleId}`,
      {},
      { headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` } },
    );

    console.info(`Successfully added user ${user.username} to guild ${guild.name} with role ${role.name}`);

    return res.json({
      title: guild.name,
      icon: guild.iconUrl,
      description: `https://solscan.io/tx/${req.body.signature}`,
      label: `Role ${role.name} obtained`,
      type: 'completed',
    });
  } catch (error) {
    console.error('Error while adding member to guild', error);
    res.json({
      title: guild.name,
      icon: guild.iconUrl,
      description: `https://solscan.io/tx/${req.body.signature}`,
      label: null,
      type: 'completed',
      error: {
        message: `An error occured. Contact the server owner and present the transaction in the description`,
      },
    });
  }
});

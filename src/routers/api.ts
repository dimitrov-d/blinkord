import express from 'express';
import axios from 'axios';
import qs from 'querystring';
import { Action } from '@solana/actions-spec';
import { actionCorsMiddleware, createPostResponse } from '@solana/actions';
import { generateSendTransaction } from '../services/transaction';
import env from '../services/env';
import { findGuildById } from '../database/database';

export const apiRouter = express.Router();
apiRouter.use(actionCorsMiddleware({}));

const BASE_URL = env.APP_BASE_URL;

apiRouter.get('/:guildId', async (req, res) => {
  const { guildId } = req.params;
  if (!guildId) return res.status(500).send('Invalid data');

  const guild = await findGuildById(guildId);
  if (!guild)
    return res.json({
      type: 'completed',
      links: { actions: [] },
      title: 'Not found',
      icon: 'https://agentestudio.com/uploads/post/image/69/main_how_to_design_404_page.png',
      description: 'Discord server not found',
    });

  const { code } = req.query;
  const payload: Action<'action'> = {
    type: 'action',
    label: null,
    title: guild.name,
    icon: guild.iconUrl,
    description: guild.description,
    links: {
      actions: guild.roles.map((role) => ({
        label: `${role.name} (${role.amount} SOL)`,
        href: `${BASE_URL}/api/${guildId}/buy?roleId=${role.id}&code=${code}`,
      })),
    },
    disabled: !code,
    error: code ? null : { message: `Discord login required, visit ${BASE_URL}/blinkord/${guildId}` },
  };

  return res.json(payload);
});

apiRouter.post('/:guildId/buy', async (req, res) => {
  const { code, roleId } = req.query;
  const { guildId } = req.params;

  if (!guildId || !code || !roleId) return res.status(500).send('Invalid data');

  const guild = await findGuildById(guildId);
  if (!guild) return res.status(404).send('Guild not found');

  const role = guild.roles.find((r) => r.id === roleId);
  if (!role) return res.status(404).send('Role not found');

  const { account } = req.body;
  try {
    // TODO: Get recipient from DB guild
    const transaction = await generateSendTransaction(account, role.amount, env.DEFAULT_RECIPIENT);

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
    console.error(`Error during generating transaction: ${error}`);
    res.status(500).send('An error occurred');
  }
});

apiRouter.post('/:guildId/confirm', async (req, res) => {
  const { code, roleId } = req.query;
  const { guildId } = req.params;

  if (!guildId || !roleId || !code) return res.status(500).send('Invalid data');

  const guild = await findGuildById(guildId);
  if (!guild) return res.status(404).send('Guild not found');

  const role = guild.roles.find((r) => r.id === roleId);
  if (!role) return res.status(404).send('Role not found');

  // Exchange the authorization code for an access token
  try {
    const tokenResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      qs.stringify({
        client_id: env.DISCORD_CLIENT_ID,
        client_secret: env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code.toString(),
        redirect_uri: env.DISCORD_REDIRECT_URI,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    const accessToken = tokenResponse.data.access_token;

    const { data: user } = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    await axios.put(
      `https://discord.com/api/guilds/${guildId}/members/${user.id}`,
      { access_token: accessToken, roles: [roleId] },
      { headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` } },
    );

    await axios.put(
      `https://discord.com/api/guilds/${guildId}/members/${user.id}/roles/${roleId}`,
      {},
      { headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` } },
    );

    const payload: Action<'completed'> = {
      title: guild.name,
      icon: guild.iconUrl,
      description: guild.description,
      label: `Role ${role.name} obtained`,
      type: 'completed',
    };
    return res.json(payload);
  } catch (error) {
    console.error(`Error during OAuth2 process: ${error}`);
    res.status(500).send('An error occurred');
  }
});

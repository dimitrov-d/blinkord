import axios from 'axios';
import qs from 'querystring';
import env from '../services/env';

export const discordApi = axios.create({ baseURL: 'https://discord.com/api/v10' });

export async function getDiscordAccessToken(code: string) {
  const { data } = await discordApi.post(
    '/oauth2/token',
    qs.stringify({
      client_id: env.DISCORD_CLIENT_ID,
      client_secret: env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code.toString(),
      redirect_uri: env.DISCORD_REDIRECT_URI,
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  );
  return data;
}

export async function sendDiscordLogMessage(channelId: string, title: string, description: string) {
  try {
    await discordApi.post(
      `/channels/${channelId}/messages`,
      {
        embeds: [
          {
            color: 0x61d1aa,
            title,
            description,
            timestamp: new Date().toISOString(),
          },
        ],
      },
      { headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` } },
    );
  } catch (err) {
    console.error(`Error sending log message: ${err}`);
  }
}

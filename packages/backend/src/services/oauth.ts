import axios from 'axios';
import qs from 'querystring';
import env from './env';

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
  return data.access_token;
}

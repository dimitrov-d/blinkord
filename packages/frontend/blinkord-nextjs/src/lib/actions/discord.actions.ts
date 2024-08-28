import { DISCORD_API_BASE_URL } from '@/lib/utils';
import env from '@/services/env';
import { discordApi, getDiscordAccessToken } from '@/services/oauth';
import jwt from 'jsonwebtoken';

// Fetch the Discord login URL for OAuth
export async function getDiscordLoginUrl(owner: boolean): Promise<string> {
  const clientId = env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(env.DISCORD_REDIRECT_URI);
  const isJoin = owner ? '' : '.join';

  return `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify+guilds${isJoin}`;
}

export async function handleDiscordCallback(code: string) {
  const accessToken = await getDiscordAccessToken(code as string);
  console.info(`Login access token obtained, fetching user profile and guild data...`);

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

  const guildIds = ownerOrAdminGuilds.map((guild: any) => guild.id);

  console.info(`Successfully fetched user guilds, ${ownerOrAdminGuilds.length} in total.`);

  // Generate a JWT token for authentication
  const userId = user.id;
  const username = user.username;
  const token = jwt.sign({ userId, username, guildIds }, env.JWT_SECRET, { expiresIn: '1d' });

  // Return the token, user data and filtered guilds with info if bot is in
  return {
    token,
    userId,
    username,
    guilds: ownerOrAdminGuilds.map(({ id, name, icon }) => ({
      id,
      name,
      image: icon ? `https://cdn.discordapp.com/icons/${id}/${icon}.png` : null,
      hasBot: botGuilds.some((g) => g.id === id),
    })),
  };
}

// Get roles for a specific guild using the JWT token for authentication
export async function getGuildRoles(guildId: string, token: string) {
  const { data: roles } = await discordApi.get(`/guilds/${guildId}/roles`, {
    headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
  });

  console.info(`Fetched ${roles.length} roles for guild ${guildId}`);

  const blinkordRolePosition = roles.find((r) => r.tags?.bot_id === env.DISCORD_CLIENT_ID)?.position;

  return {
    roles: roles
      .filter((r) => !r.managed && r.name !== '@everyone')
      .sort((a, b) => b.position - a.position)
      .map(({ id, name, position }) => ({ id, name, position })),
    blinkordRolePosition,
  };
}

// Create a new guild, sending the JWT token for authentication
export async function createGuild(guildData: any, address: string, message: string, signature: string, token: string) {
  try {
    const response = await fetch(`${DISCORD_API_BASE_URL}/discord/guilds`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: guildData,
        address,
        message,
        signature,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error creating guild:', errorData);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Guild created:', data);
    return data;
  } catch (error) {
    console.error('Failed to create guild:', error);
    throw error;
  }
}

// Edit an existing guild using the JWT token for authentication
export async function editGuild(
  guildId: string,
  guildData: any,
  address: string,
  message: string,
  signature: string,
  token: string,
) {
  try {
    const response = await fetch(`${DISCORD_API_BASE_URL}/discord/guilds/${guildId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: guildData,
        address,
        message,
        signature,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error editing guild:', errorData);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Guild edited:', data);
    return data;
  } catch (error) {
    console.error('Failed to edit guild:', error);
    throw error;
  }
}

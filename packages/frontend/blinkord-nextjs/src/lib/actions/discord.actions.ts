import { useUserStore } from "@/lib/contexts/zustand/userStore";
import { DiscordRole } from '@/lib/types'
import { initializeDatabase, insertGuild, updateGuild } from '@/database/database';
import { Guild } from '@/database/entities/guild';
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

export async function createGuild(data: Partial<Guild>) {
  await initializeDatabase();
  console.info(`Going to create guild: ${JSON.stringify(data)}`);

  await insertGuild(new Guild(data));
  console.info(`Guild ${data.id} inserted successfully`);
}

export async function editGuildData(guildId: string, data: Partial<Guild>) {
  await initializeDatabase();
  console.info(`Going to update guild: ${JSON.stringify(data)}`);

  await updateGuild(guildId, data);
  console.info(`Guild ${guildId} updated successfully`);
}


// Fetch roles for a given guild
export const fetchRoles = async (guildId: string, setRoles: (roles: DiscordRole[]) => void) => {
  const token = useUserStore.getState().token || localStorage.getItem("discordToken");

  try {
    const response = await fetch(`/api/discord/guilds/${guildId}/roles`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error(`Failed to fetch roles for guild ${guildId}: ${response.statusText}`);
      return;
    }

    const rolesData = await response.json();
    setRoles(rolesData.roles.map((role: Omit<DiscordRole, "price" | "enabled">) => ({ ...role, price: 0, enabled: false })));
  } catch (error) {
    console.error(`Error fetching roles for guild ${guildId}`, error);
  }
};

// Check if the bot is installed on the guild
export const checkBotInstallation = async (guildId: string, setBotInstalled: (installed: boolean) => void) => {
  const token = useUserStore.getState().token || localStorage.getItem("discordToken");

  try {
    const response = await fetch(`/api/discord/guilds/${guildId}/bot-status`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error(`Failed to check bot status for guild ${guildId}: ${response.statusText}`);
      return;
    }

    const botStatus = await response.json();
    setBotInstalled(botStatus.installed);
  } catch (error) {
    console.error(`Error checking bot status for guild ${guildId}`, error);
  }
};

// Generate a custom URL for the guild
export const generateCustomUrl = (guildId: string, setCustomUrl: (url: string) => void) => {
  setCustomUrl(`https://blinkord.com/${guildId}`);
};

// Function to save the configuration
export const handleSaveConfiguration = async (
  serverId: string,
  DiscordRoles: DiscordRole[],
  token: string,
  router: any
) => {
  try {
    const DiscordRolesToSave = DiscordRoles.filter((DiscordRole) => DiscordRole.price > 0);

    const response = await fetch(`/api/discord/guilds/${serverId}/configure`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ DiscordRoles: DiscordRolesToSave }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save configuration: ${response.statusText}`);
    }

    router.push(`/servers/${serverId}/edit`);
  } catch (error) {
    console.error("Error saving configuration:", error);
    alert("An error occurred while saving the configuration. Please try again.");
  }
};

import { DISCORD_API_BASE_URL } from '@/lib/utils'

export async function getDiscordLoginUrl(owner: boolean): Promise<string> {
  const response = await fetch(`${DISCORD_API_BASE_URL}/discord/login?owner=${owner}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Discord login URL: ${response.statusText}`);
  }

  const data = await response.json();
  return data.url;
}


export async function handleDiscordCallback(code: string) {
  const response = await fetch(`${DISCORD_API_BASE_URL}/discord/login/callback?code=${code}`, {
    method: 'GET',
  });
  const data = await response.json();
  return data; // { userId, username, guilds, token }
}

export async function getGuildRoles(guildId: string, token: string) {
  const response = await fetch(`${DISCORD_API_BASE_URL}/discord/guilds/${guildId}/roles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data; // { blinkRolePosition, roles }
}

export async function createOrEditGuild(guildData: any, address: string, message: string, signature: string, token: string) {
  const response = await fetch(`${DISCORD_API_BASE_URL}/discord/guilds`, {
    method: 'POST',
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
  const data = await response.json();
  return data;
}

export async function patchGuild(guildId: string, guildData: any, address: string, message: string, signature: string, token: string) {
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
  const data = await response.json();
  return data;
}

import { DISCORD_API_BASE_URL } from "@/lib/utils";

// Fetch the Discord login URL for OAuth
export async function getDiscordLoginUrl(owner: boolean): Promise<string> {
  const response = await fetch(
    `${DISCORD_API_BASE_URL}/discord/login?owner=${owner}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Discord login URL: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.url;
}

// Handle the Discord OAuth callback by calling the backend route
export async function handleDiscordCallback(code: string) {
  const response = await fetch(
    `/api/discord/callback?code=${encodeURIComponent(code)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Backend API error:", errorData);
    throw new Error(
      `Backend API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
}

// Get roles for a specific guild using the JWT token for authentication
export async function getGuildRoles(guildId: string, token: string) {
  const response = await fetch(
    `${DISCORD_API_BASE_URL}/discord/guilds/${guildId}/roles`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  return data; // { blinkRolePosition, roles }
}

// Create a new guild, sending the JWT token for authentication
export async function createGuild(
  guildData: any,
  address: string,
  message: string,
  signature: string,
  token: string
) {
  try {
    const response = await fetch(`${DISCORD_API_BASE_URL}/discord/guilds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      console.error("Error creating guild:", errorData);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Guild created:", data);
    return data;
  } catch (error) {
    console.error("Failed to create guild:", error);
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
  token: string
) {
  try {
    const response = await fetch(
      `${DISCORD_API_BASE_URL}/discord/guilds/${guildId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: guildData,
          address,
          message,
          signature,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error editing guild:", errorData);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Guild edited:", data);
    return data;
  } catch (error) {
    console.error("Failed to edit guild:", error);
    throw error;
  }
}

import { DISCORD_API_BASE_URL } from "@/lib/utils";
import { useUserStore } from "@/lib/contexts/zustand/userStore";
import { DiscordRole } from "@/lib/types";

// Fetch the Discord login URL for OAuth
export async function getDiscordLoginUrl(owner: boolean): Promise<string> {
  const response = await fetch(
    `${DISCORD_API_BASE_URL}/discord/login${owner ? `?owner=${owner}` : ""}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  // Log the raw response text for debugging
  const responseText = await response.text();
  console.log("Raw response from Discord API:", responseText);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Discord login URL: ${response.statusText}`
    );
  }

  try {
    const data = JSON.parse(responseText);
    return data.url;
  } catch (error) {
    console.error("Failed to parse response JSON:", error);
    throw new Error("Failed to parse response from Discord API");
  }
}

export async function handleDiscordCallback(code: string) {
  try {
    console.log("Sending request to Discord API with code:", code);

    // Making a request to your backend which exchanges the code for an access token
    const response = await fetch(
      `${DISCORD_API_BASE_URL}/discord/login/callback?code=${encodeURIComponent(code)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Discord API response status:", response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Discord API error:", errorData);
      throw new Error(
        `Discord API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Full Data received from Discord API:", data); // Log the entire response data

    // Log the JWT token for debugging
    if (data.token) {
      console.log("JWT Token:", data.token);
    } else {
      console.warn("No token received in the response.");
    }

    return data; // Return the entire response data
  } catch (error) {
    console.error("Error in handleDiscordCallback:", error);
    throw error;
  }
}

// Get roles for a specific guild using the JWT token for authentication
export async function getGuildRoles(guildId: string, token: string) {
  const response = await fetch(
    `${DISCORD_API_BASE_URL}/discord/guilds/${guildId}/roles`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return await response.json(); // { blinkRolePosition, roles }
}

export async function getGuild(guildId: string, token: string) {
  const response = await fetch(
    `${DISCORD_API_BASE_URL}/discord/guilds/${guildId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return await response.json();
}

// Create a new guild, sending the JWT token for authentication
export async function createGuild(
  payload: { data: any; message: string; signature: string; address: string },
  token: string
) {
  try {
    const response = await fetch(`${DISCORD_API_BASE_URL}/discord/guilds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
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

// Edit an existing guild using the JWT token and signature  for authentication
export async function editGuild(
  guildId: string,
  payload: { data: any; message: string; signature: string; address: string },
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
        body: JSON.stringify(payload),
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

// Fetch roles for a given guild
export const fetchRoles = async (
  guildId: string,
  setRoles: (roles: DiscordRole[]) => void
) => {
  const token =
    useUserStore.getState().token || localStorage.getItem("discordToken");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${guildId}/roles`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch roles for guild ${guildId}: ${response.statusText}`
      );
      return;
    }

    const rolesData = await response.json();
    setRoles(
      rolesData.roles.map((role: Omit<DiscordRole, "price" | "enabled">) => ({
        ...role,
        price: 0,
        enabled: false,
      }))
    );
  } catch (error) {
    console.error(`Error fetching roles for guild ${guildId}`, error);
  }
};

// Generate a custom URL for the guild
export const generateCustomUrl = (
  guildId: string,
  setCustomUrl: (url: string) => void
) => {
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
    const DiscordRolesToSave = DiscordRoles.filter(
      (DiscordRole) => DiscordRole.price > 0
    );

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
    alert(
      "An error occurred while saving the configuration. Please try again."
    );
  }
};

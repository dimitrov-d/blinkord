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

  // Log the raw response text for debugging
  const responseText = await response.text();
  console.log("Raw response from Discord API:", responseText);

  if (!response.ok) {
    throw new Error(`Failed to fetch Discord login URL: ${response.statusText}`);
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
      method: "GET",
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

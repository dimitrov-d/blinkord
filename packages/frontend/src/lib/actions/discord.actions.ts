import { useUserStore } from "@/lib/contexts/zustand/userStore";
import { DiscordRole } from "@/lib/types";

// Fetch roles for a given guild
export const fetchRoles = async (
  guildId: string
): Promise<{ roles: DiscordRole[]; blinkordRolePosition: number }> => {
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
      return { roles: [], blinkordRolePosition: -1 };
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching roles for guild ${guildId}`, error);
    return { roles: [], blinkordRolePosition: -1 };
  }
};

// Create an embedded wallet for a Discord user
export const createEmbeddedWallet = async (
  accessToken: string,
  discordUserId: string,
  address: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/embedded-wallet`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ accessToken, discordUserId, address }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        `Failed to create embedded wallet: ${response.statusText}`,
        errorData
      );
      return { success: false, error: errorData.error };
    }

    return { success: true };
  } catch (error) {
    console.error(`Error creating embedded wallet`, error);
    return { success: false, error: `${error}` };
  }
};

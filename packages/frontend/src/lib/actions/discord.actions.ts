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

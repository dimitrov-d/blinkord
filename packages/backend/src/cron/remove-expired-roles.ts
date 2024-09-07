import { schedule } from 'node-cron';
import { discordApi } from '../services/oauth';
import env from '../services/env';
import { getExpiringRoles, initializeDatabase } from '../database/database';

// Cron job to run every hour
schedule(
  '0 * * * *',
  async () => {
    await initializeDatabase();

    const expiringRoles = await getExpiringRoles();
    console.info(`Total expired roles: ${expiringRoles.length}`);

    // Remove roles for each expired role purchase
    for (const rolePurchase of expiringRoles) {
      if (!rolePurchase.guild || !rolePurchase.role) continue;
      const {
        discordUserId,
        guild: { id: guildId, name: guildName },
        role: { id: roleId, name: roleName },
      } = rolePurchase;

      await discordApi
        .delete(`/guilds/${guildId}/members/${discordUserId}/roles/${roleId}`, {
          headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
        })
        .then(() => console.info(`Removed role ${roleId} from user ${discordUserId}`))
        .catch((error) => console.error(`Failed to remove role ${roleId} from user ${discordUserId}: ${error}`));

      try {
        const { data: dmChannel } = await discordApi.post(
          `/users/@me/channels`,
          { recipient_id: discordUserId },
          { headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` } },
        );
        await discordApi.post(
          `/channels/${dmChannel.id}/messages`,
          {
            content: `Your role ${roleName} on the server ${guildName} has expired. Renew it on <https://blinkord.com/${guildId}>`,
          },
          { headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` } },
        );
      } catch (error) {}
    }
  },
  { recoverMissedExecutions: true, runOnInit: true },
);

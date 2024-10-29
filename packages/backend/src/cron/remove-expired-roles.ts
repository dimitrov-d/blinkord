import { schedule } from 'node-cron';
import { discordApi, sendDiscordLogMessage } from '../services/oauth';
import env from '../services/env';
import { getExpiringRoles, initializeDatabase } from '../database/database';

// Cron job to run every hour
schedule(
  '0 * * * *',
  async () => {
    await initializeDatabase();

    const expiringRoles = await getExpiringRoles();
    console.info(`Total expiring roles: ${expiringRoles.length}`);

    const now = new Date();

    for (const rolePurchase of expiringRoles) {
      const {
        discordUserId,
        guild: { id: guildId, name: guildName },
        role: { id: roleId, name: roleName },
        expiresAt,
      } = rolePurchase;

      const hoursUntilExpiration = Math.floor((new Date(expiresAt).getTime() - now.getTime()) / (1000 * 60 * 60));

      if (hoursUntilExpiration === 3 * 24 || hoursUntilExpiration === 24) {
        // Send reminder
        await sendDiscordMessage(
          discordUserId,
          `**Reminder**: Your role **${roleName}** on the server **${guildName}** will expire in ${hoursUntilExpiration / 24} ${hoursUntilExpiration / 24 === 1 ? 'day' : 'days'}. \nRenew it on <https://blinkord.com/${guildId}>`,
        );
      } else if (hoursUntilExpiration <= 0) {
        // Remove role
        await discordApi
          .delete(`/guilds/${guildId}/members/${discordUserId}/roles/${roleId}`, {
            headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
          })
          .then(() => console.info(`Removed role ${roleId} from user ${discordUserId}`))
          .catch((error) => console.error(`Failed to remove role ${roleId} from user ${discordUserId}: ${error}`));

        await sendDiscordMessage(
          discordUserId,
          `Your role **${roleName}** on the server **${guildName}** has expired. \nRenew it on <https://blinkord.com/${guildId}>`,
        );

        sendDiscordLogMessage(
          '1300902493458272369',
          'Role Expired',
          `**User:** <@${discordUserId}>\n**Role:** ${roleName}\n**Server:** ${guildName}`,
        );
      }
    }
  },
  { recoverMissedExecutions: true, runOnInit: true },
);

const sendDiscordMessage = async (discordUserId: string, content: string) => {
  try {
    const { data: dmChannel } = await discordApi.post(
      `/users/@me/channels`,
      { recipient_id: discordUserId },
      { headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` } },
    );
    await discordApi.post(
      `/channels/${dmChannel.id}/messages`,
      { embeds: [{ description: content, color: 0x61d1aa }] },
      { headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` } },
    );
  } catch (error) {
    console.error(`Failed to send message to user ${discordUserId}: ${error}`);
  }
};

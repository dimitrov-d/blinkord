import { schedule } from 'node-cron';
import { discordApi, sendDiscordLogMessage } from '../services/oauth';
import env from '../services/env';
import { getAllRolesForUser as getUserRolePurchases, getExpiringRoles, initializeDatabase } from '../database/database';

// Cron job to run every hour
schedule(
  '0 * * * *',
  async () => {
    if (env.NODE_ENV === 'development') return;

    await initializeDatabase();
    const expiringRoles = await getExpiringRoles();

    // Ensure expiring roles are unique by guild.id, role.id, and discordUserId
    const uniqueExpiringRoles = expiringRoles
      .reduce((acc, rolePurchase) => {
        const key = `${rolePurchase.guild.id}-${rolePurchase.role.id}-${rolePurchase.discordUserId}`;
        if (!acc.has(key)) {
          acc.set(key, rolePurchase);
        }
        return acc;
      }, new Map())
      .values();

    console.info(`Total expiring roles: ${expiringRoles.length}`);

    const now = new Date();

    for (const rolePurchase of uniqueExpiringRoles) {
      const {
        discordUserId,
        guild: { id: guildId, name: guildName, useUsdc },
        role: { id: roleId, name: roleName, amount: currentAmount },
        expiresAt,
        paidAmount,
      } = rolePurchase;

      const userRolePurchases = await getUserRolePurchases(discordUserId, guildId, roleId);

      // If the user has renewed the role, skip
      if (userRolePurchases.length > 1 && userRolePurchases.some((role) => new Date(role.expiresAt) > expiresAt)) {
        console.info(`User ${discordUserId} has renewed the role ${roleName} on guild ${guildName}, skipping`);
        continue;
      }

      const hoursUntilExpiration = Math.floor((new Date(expiresAt).getTime() - now.getTime()) / (1000 * 60 * 60));

      // Check if the user has a grandfathered rate that differs from the current price
      const currency = useUsdc ? 'USDC' : 'SOL';
      const priceHasChanged = paidAmount != null && +paidAmount !== +currentAmount;
      const formatPrice = (n: string | number) => Number(Number(n).toFixed(2));
      const pricingWarning = priceHasChanged
        ? `\n\n⚠️ **Important:** If you don't renew within **3 days** of expiration, your current rate of **${formatPrice(paidAmount)} ${currency}** will be lost and you'll pay the new price of **${formatPrice(currentAmount)} ${currency}**.`
        : '';

      if (hoursUntilExpiration === 3 * 24 || hoursUntilExpiration === 24) {
        // Send reminder with grandfathered pricing warning
        await sendDiscordMessage(
          discordUserId,
          `**Reminder**: Your role **${roleName}** on the server **${guildName}** will expire in ${hoursUntilExpiration / 24} ${hoursUntilExpiration / 24 === 1 ? 'day' : 'days'}.${pricingWarning}\n\nRenew it on <https://blinkord.com/${guildId}>`,
        );
      } else if (hoursUntilExpiration === 0) {
        // Remove role
        await discordApi
          .delete(`/guilds/${guildId}/members/${discordUserId}/roles/${roleId}`, {
            headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
          })
          .then(() => console.info(`Removed role ${roleId} from user ${discordUserId}`))
          .catch((error) => console.error(`Failed to remove role ${roleId} from user ${discordUserId}: ${error}`));

        const expirationPricingWarning = priceHasChanged
          ? `\n\n⚠️ **You have 3 days** to renew at your current rate of **${formatPrice(paidAmount)} ${currency}**. After that, the price will be **${formatPrice(currentAmount)} ${currency}**.`
          : '';

        await sendDiscordMessage(
          discordUserId,
          `Your role **${roleName}** on the server **${guildName}** has expired.${expirationPricingWarning}\n\nRenew it on <https://blinkord.com/${guildId}>`,
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

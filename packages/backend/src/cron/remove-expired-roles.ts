import { schedule } from 'node-cron';
import { discordApi, sendDiscordLogMessage } from '../services/oauth';
import env from '../services/env';
import {
  getAllRolesForUser as getUserRolePurchases,
  getExpiredRolePurchases,
  getRolesNeedingReminder,
  initializeDatabase,
} from '../database/database';
import { RolePurchase } from '../database/entities/role-purchase';

const HOUR_MS = 1000 * 60 * 60;

/** Reminder bands tolerate hourly cron jitter (exact === was missing ticks). */
function isInReminderBand(hoursUntilExpiration: number, targetHours: number): boolean {
  return hoursUntilExpiration >= targetHours - 1 && hoursUntilExpiration <= targetHours;
}

function hasNewerPurchase(purchases: RolePurchase[], expiresAt: Date): boolean {
  return purchases.length > 1 && purchases.some((role) => new Date(role.expiresAt) > new Date(expiresAt));
}

function buildPricingWarning(
  rolePurchase: RolePurchase,
  kind: 'reminder' | 'expiration',
): string {
  const {
    guild: { useUsdc },
    role: { amount: currentAmount },
    paidAmount,
  } = rolePurchase;

  const priceHasChanged = paidAmount != null && +paidAmount !== +currentAmount;
  if (!priceHasChanged) return '';

  const currency = useUsdc ? 'USDC' : 'SOL';
  const formatPrice = (n: string | number) => Number(Number(n).toFixed(2));

  if (kind === 'reminder') {
    return `\n\n⚠️ **Important:** If you don't renew within **3 days** of expiration, your current rate of **${formatPrice(paidAmount)} ${currency}** will be lost and you'll pay the new price of **${formatPrice(currentAmount)} ${currency}**.`;
  }

  return `\n\n⚠️ **You have 3 days** to renew at your current rate of **${formatPrice(paidAmount)} ${currency}**. After that, the price will be **${formatPrice(currentAmount)} ${currency}**.`;
}

async function processReminders(now: Date) {
  const rolesNeedingReminder = await getRolesNeedingReminder();
  console.info(`Roles needing reminder: ${rolesNeedingReminder.length}`);

  let remindersSent = 0;

  // Dedupe by guild+role+user
  const uniqueRoles = [
    ...rolesNeedingReminder
      .reduce((acc, rolePurchase) => {
        const key = `${rolePurchase.guild.id}-${rolePurchase.role.id}-${rolePurchase.discordUserId}`;
        if (!acc.has(key)) acc.set(key, rolePurchase);
        return acc;
      }, new Map<string, RolePurchase>())
      .values(),
  ];

  for (const rolePurchase of uniqueRoles) {
    const {
      discordUserId,
      guild: { id: guildId, name: guildName },
      role: { id: roleId, name: roleName },
      expiresAt,
    } = rolePurchase;

    const userRolePurchases = await getUserRolePurchases(discordUserId, guildId, roleId);
    if (hasNewerPurchase(userRolePurchases, expiresAt)) {
      console.info(`User ${discordUserId} has renewed the role ${roleName} on guild ${guildName}, skipping reminder`);
      continue;
    }

    const hoursUntilExpiration = Math.floor((new Date(expiresAt).getTime() - now.getTime()) / HOUR_MS);
    const pricingWarning = buildPricingWarning(rolePurchase, 'reminder');

    if (isInReminderBand(hoursUntilExpiration, 3 * 24) || isInReminderBand(hoursUntilExpiration, 24)) {
      const daysLeft = Math.round(hoursUntilExpiration / 24);
      await sendDiscordMessage(
        discordUserId,
        `**Reminder**: Your role **${roleName}** on the server **${guildName}** will expire in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}.${pricingWarning}\n\nRenew it on <https://blinkord.com/${guildId}>`,
      );
      remindersSent += 1;
    }
  }

  console.info(`Reminders sent: ${remindersSent}`);
}

async function processExpiredRoles(now: Date) {
  const expiredPurchases = await getExpiredRolePurchases();
  console.info(`Expired role purchases to process: ${expiredPurchases.length}`);

  let removed = 0;
  let skippedRenewed = 0;
  let skippedNoRole = 0;
  let skippedNotInGuild = 0;
  let failed = 0;

  for (const rolePurchase of expiredPurchases) {
    const {
      discordUserId,
      guild: { id: guildId, name: guildName },
      role: { id: roleId, name: roleName },
    } = rolePurchase;

    // Skip if user has a newer purchase that is still active
    const userRolePurchases = await getUserRolePurchases(discordUserId, guildId, roleId);
    const hasActiveRenewal = userRolePurchases.some((role) => new Date(role.expiresAt) > now);
    if (hasActiveRenewal) {
      skippedRenewed += 1;
      continue;
    }

    try {
      // Confirm the member still has the role before removing — avoids re-DMing historical expiries
      const { data: member } = await discordApi.get(`/guilds/${guildId}/members/${discordUserId}`, {
        headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
      });

      if (!member.roles?.includes(roleId)) {
        skippedNoRole += 1;
        continue;
      }

      await discordApi.delete(`/guilds/${guildId}/members/${discordUserId}/roles/${roleId}`, {
        headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
      });
      console.info(`Removed role ${roleName} (${roleId}) from user ${discordUserId} on guild ${guildName}`);
      removed += 1;

      const expirationPricingWarning = buildPricingWarning(rolePurchase, 'expiration');
      await sendDiscordMessage(
        discordUserId,
        `Your role **${roleName}** on the server **${guildName}** has expired.${expirationPricingWarning}\n\nRenew it on <https://blinkord.com/${guildId}>`,
      );

      sendDiscordLogMessage(
        '1300902493458272369',
        'Role Expired',
        `**User:** <@${discordUserId}>\n**Role:** ${roleName}\n**Server:** ${guildName}`,
      );

      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 404) {
        skippedNotInGuild += 1;
        console.info(`User ${discordUserId} not found on guild ${guildId}`);
      } else {
        failed += 1;
        console.error(`Failed to remove role ${roleId} from user ${discordUserId}: ${error}`);
      }
    }
  }

  console.info(
    `Expired role cleanup summary: removed=${removed}, skippedRenewed=${skippedRenewed}, skippedNoRole=${skippedNoRole}, skippedNotInGuild=${skippedNotInGuild}, failed=${failed}`,
  );
}

// Cron job to run every hour
schedule(
  '0 * * * *',
  async () => {
    if (env.NODE_ENV === 'development') return;

    await initializeDatabase();
    const now = new Date();

    await processReminders(now);
    await processExpiredRoles(now);
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

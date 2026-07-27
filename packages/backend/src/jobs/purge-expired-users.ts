import { getAllGuilds, getSubscriptionsByGuildId } from '../database/database';
import { RolePurchase } from '../database/entities/role-purchase';
import env from '../services/env';
import { discordApi } from '../services/oauth';

export const DEFAULT_PURGE_GUILD_ID = '925207817923743794'; // SOL Decoder

export type PurgeOptions = {
  dryRun?: boolean;
};

export type PurgePass1Summary = {
  checked: number;
  removed: number;
  dryRunWouldRemove: number;
  skippedActive: number;
  skippedNoRole: number;
  skippedNotInGuild: number;
  failed: number;
};

export type PurgePass2Summary = {
  membersChecked: number;
  membersWithManagedRoles: number;
  removed: number;
  dryRunWouldRemove: number;
  failed: number;
};

export type PurgeGuildSummary = {
  guildId: string;
  guildName?: string;
  subscriptionCount: number;
  uniqueUserRoles: number;
  pass1: PurgePass1Summary;
  pass2: PurgePass2Summary;
};

function latestPurchaseKey(discordUserId: string, roleId: string) {
  return `${discordUserId}:${roleId}`;
}

/** Latest purchase per (discordUserId, roleId). */
function groupLatestByUserAndRole(subscriptions: RolePurchase[]): Map<string, RolePurchase> {
  const latest = new Map<string, RolePurchase>();

  for (const sub of subscriptions) {
    if (!sub.role?.id) continue;
    const key = latestPurchaseKey(sub.discordUserId, sub.role.id);
    const existing = latest.get(key);
    if (!existing || new Date(sub.expiresAt) > new Date(existing.expiresAt)) {
      latest.set(key, sub);
    }
  }

  return latest;
}

async function removeRole(
  guildId: string,
  userId: string,
  roleId: string,
  dryRun: boolean,
  reason: string,
): Promise<'removed' | 'dry-run' | 'failed'> {
  if (dryRun) {
    console.log(`[dry-run] Would remove role ${roleId} from user ${userId} (${reason})`);
    return 'dry-run';
  }

  try {
    await discordApi.delete(`/guilds/${guildId}/members/${userId}/roles/${roleId}`, {
      headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
    });
    console.log(`Removed role ${roleId} from user ${userId} (${reason})`);
    await new Promise((resolve) => setTimeout(resolve, 100));
    return 'removed';
  } catch (error: any) {
    console.error(`Failed to remove role ${roleId} from user ${userId}: ${error}`);
    return 'failed';
  }
}

async function purgeExpiredPurchases(
  guildId: string,
  latestByUserRole: Map<string, RolePurchase>,
  dryRun: boolean,
): Promise<PurgePass1Summary> {
  const now = new Date();
  let checked = 0;
  let removed = 0;
  let dryRunWouldRemove = 0;
  let skippedActive = 0;
  let skippedNoRole = 0;
  let skippedNotInGuild = 0;
  let failed = 0;

  console.log(`Pass 1: checking ${latestByUserRole.size} latest purchases for overdue roles`);

  for (const subscription of latestByUserRole.values()) {
    checked += 1;
    const userId = subscription.discordUserId;
    const roleId = subscription.role.id;
    const roleName = subscription.role.name;

    // Null expiresAt = permanent role; leave it alone
    if (!subscription.expiresAt || new Date(subscription.expiresAt) > now) {
      skippedActive += 1;
      continue;
    }

    try {
      const { data: member } = await discordApi.get(`/guilds/${guildId}/members/${userId}`, {
        headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
      });

      if (!member.roles?.includes(roleId)) {
        skippedNoRole += 1;
        continue;
      }

      const result = await removeRole(
        guildId,
        userId,
        roleId,
        dryRun,
        `expired purchase; role=${roleName}`,
      );
      if (result === 'removed') removed += 1;
      else if (result === 'dry-run') dryRunWouldRemove += 1;
      else failed += 1;
    } catch (error: any) {
      if (error.response?.status === 404) {
        skippedNotInGuild += 1;
        console.log(`User ${userId} not found in guild`);
      } else {
        failed += 1;
        console.error(`Error processing user ${userId}:`, error);
      }
    }
  }

  return {
    checked,
    removed,
    dryRunWouldRemove,
    skippedActive,
    skippedNoRole,
    skippedNotInGuild,
    failed,
  };
}

async function fetchAllGuildMembers(guildId: string): Promise<any[]> {
  let allMembers: any[] = [];
  let after: string | undefined;
  let fetchedMembers: any[] = [];

  do {
    const params = new URLSearchParams();
    params.append('limit', '1000');
    if (after) params.append('after', after);

    const { data: membersChunk } = await discordApi
      .get(`/guilds/${guildId}/members?${params.toString()}`, {
        headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
      })
      .catch((error) => {
        console.error(`Error getting members: ${error}`);
        return { data: [] };
      });

    fetchedMembers = membersChunk;
    if (fetchedMembers.length > 0) {
      allMembers = allMembers.concat(fetchedMembers);
      after = fetchedMembers[fetchedMembers.length - 1].user.id;
    } else {
      after = undefined;
    }
  } while (fetchedMembers.length === 1000);

  return allMembers;
}

async function auditMembersForOrphanedRoles(
  guildId: string,
  latestByUserRole: Map<string, RolePurchase>,
  dryRun: boolean,
): Promise<PurgePass2Summary> {
  console.log('Pass 2: auditing guild members for managed roles without an active subscription');

  const members = await fetchAllGuildMembers(guildId);
  console.log(`Checking ${members.length} guild members`);

  const managedRoleIds = new Set<string>();
  for (const subscription of latestByUserRole.values()) {
    managedRoleIds.add(subscription.role.id);
  }
  console.log(`Found ${managedRoleIds.size} managed roles to check`);

  const now = new Date();
  let membersWithManagedRoles = 0;
  let removed = 0;
  let dryRunWouldRemove = 0;
  let failed = 0;

  for (const member of members) {
    try {
      const userId = member.user.id;
      const memberRoles: string[] = member.roles || [];
      const managedRolesOnMember = memberRoles.filter((roleId) => managedRoleIds.has(roleId));
      if (managedRolesOnMember.length === 0) continue;

      membersWithManagedRoles += 1;

      for (const roleId of managedRolesOnMember) {
        const key = latestPurchaseKey(userId, roleId);
        const latest = latestByUserRole.get(key);
        // Active = unexpired, or permanent (null expiresAt)
        const hasActiveSubscription =
          !!latest && (!latest.expiresAt || new Date(latest.expiresAt) > now);

        if (hasActiveSubscription) continue;

        const result = await removeRole(
          guildId,
          userId,
          roleId,
          dryRun,
          latest ? 'no active subscription' : 'no purchase record for managed role',
        );
        if (result === 'removed') removed += 1;
        else if (result === 'dry-run') dryRunWouldRemove += 1;
        else failed += 1;
      }
    } catch (error) {
      failed += 1;
      console.error(`Error checking member ${member.user?.id}: ${error}`);
    }
  }

  return { membersChecked: members.length, membersWithManagedRoles, removed, dryRunWouldRemove, failed };
}

export function logPurgeSummary(summary: PurgeGuildSummary) {
  console.log(`--- Summary (${summary.guildId}${summary.guildName ? ` / ${summary.guildName}` : ''}) ---`);
  console.log(
    `Pass 1 (expired purchases): checked=${summary.pass1.checked}, removed=${summary.pass1.removed}, dryRunWouldRemove=${summary.pass1.dryRunWouldRemove}, skippedActive=${summary.pass1.skippedActive}, skippedNoRole=${summary.pass1.skippedNoRole}, skippedNotInGuild=${summary.pass1.skippedNotInGuild}, failed=${summary.pass1.failed}`,
  );
  console.log(
    `Pass 2 (member audit): membersChecked=${summary.pass2.membersChecked}, membersWithManagedRoles=${summary.pass2.membersWithManagedRoles}, removed=${summary.pass2.removed}, dryRunWouldRemove=${summary.pass2.dryRunWouldRemove}, failed=${summary.pass2.failed}`,
  );
}

/**
 * Discord reconciliation for one guild:
 * Pass 1 — remove roles for overdue purchases
 * Pass 2 — strip managed roles from members with no active subscription
 */
export async function purgeExpiredUsersForGuild(
  guildId: string,
  options: PurgeOptions = {},
): Promise<PurgeGuildSummary> {
  const dryRun = options.dryRun ?? false;
  console.log(`Starting purge-expired-users for guild ${guildId}${dryRun ? ' (dry-run)' : ''}`);

  const subscriptions = await getSubscriptionsByGuildId(guildId);
  console.log(`Found ${subscriptions.length} total subscriptions`);

  const latestByUserRole = groupLatestByUserAndRole(subscriptions);
  console.log(`Found ${latestByUserRole.size} unique user+role subscriptions`);

  const pass1 = await purgeExpiredPurchases(guildId, latestByUserRole, dryRun);
  const pass2 = await auditMembersForOrphanedRoles(guildId, latestByUserRole, dryRun);

  const summary: PurgeGuildSummary = {
    guildId,
    guildName: subscriptions[0]?.guild?.name,
    subscriptionCount: subscriptions.length,
    uniqueUserRoles: latestByUserRole.size,
    pass1,
    pass2,
  };

  logPurgeSummary(summary);
  return summary;
}

/**
 * Run reconciliation for every guild with limited-time roles enabled.
 */
export async function purgeExpiredUsersForLimitedTimeGuilds(
  options: PurgeOptions = {},
): Promise<PurgeGuildSummary[]> {
  const guilds = await getAllGuilds();
  const targets = guilds.filter((guild) => guild.limitedTimeRoles);

  console.log(
    `Reconciling ${targets.length} limited-time guilds${options.dryRun ? ' (dry-run)' : ''}`,
  );

  const summaries: PurgeGuildSummary[] = [];
  for (const guild of targets) {
    const summary = await purgeExpiredUsersForGuild(guild.id, options);
    summary.guildName = guild.name;
    summaries.push(summary);
  }

  const totalFailed = summaries.reduce((n, s) => n + s.pass1.failed + s.pass2.failed, 0);
  const totalRemoved = summaries.reduce((n, s) => n + s.pass1.removed + s.pass2.removed, 0);
  console.log(
    `Reconciliation complete: guilds=${summaries.length}, removed=${totalRemoved}, failed=${totalFailed}`,
  );

  return summaries;
}

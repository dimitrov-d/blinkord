import { schedule } from 'node-cron';
import { getSubscriptionsByGuildId, initializeDatabase } from '../database/database';
import env from '../services/env';
import { discordApi } from '../services/oauth';

const GUILD_ID = '925207817923743794'; // SOL Decoder

schedule(
  '0 0 * * *',
  async () => {
    if (env.NODE_ENV === 'development') return;

    await purgeExpiredUsers();
  },
  { recoverMissedExecutions: true, runOnInit: false },
);

async function purgeExpiredUsers() {
  try {
    await initializeDatabase();

    // Get all subscriptions for the guild
    const subscriptions = await getSubscriptionsByGuildId(GUILD_ID);
    console.log(`Found ${subscriptions.length} total subscriptions`);

    // Group subscriptions by user and get the latest one for each
    const latestSubscriptions = subscriptions.reduce((acc, sub) => {
      const existing = acc.get(sub.discordUserId);
      if (!existing || new Date(sub.expiresAt) > new Date(existing.expiresAt)) {
        acc.set(sub.discordUserId, sub);
      }
      return acc;
    }, new Map());

    console.log(`Found ${latestSubscriptions.size} unique users with subscriptions`);

    const now = new Date();

    // Process each user's latest subscription
    for (const [userId, subscription] of latestSubscriptions) {
      try {
        // Skip if subscription hasn't expired yet
        if (new Date(subscription.expiresAt) > now) {
          continue;
        }

        // Check if user has the role
        const { data: member } = await discordApi.get(`/guilds/${GUILD_ID}/members/${userId}`, {
          headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
        });

        if (member.roles.includes(subscription.role.id)) {
          // Remove the role
          await discordApi.delete(`/guilds/${GUILD_ID}/members/${userId}/roles/${subscription.role.id}`, {
            headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
          });
          console.log(`Removed role ${subscription.role.name} from user ${userId}`);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log(`User ${userId} not found in guild`);
        } else {
          console.error(`Error processing user ${userId}:`, error);
        }
      }
    }

    console.log('Finished purging expired users');
    // Additional fraud prevention: Check all users with the role and remove if they don't have active subscriptions
    await checkUsersWithRoleForActiveSubscriptions(latestSubscriptions);
  } catch (error) {
    console.error('Error in purgeExpiredUsers:', error);
  }
}

async function checkUsersWithRoleForActiveSubscriptions(activeSubscriptions: Map<string, any>) {
  console.log('Checking users with role for active subscriptions');
  try {
    let allMembers: any[] = [];
    let after: string | undefined = undefined;
    let fetchedMembers: any[] = [];
    do {
      const params = new URLSearchParams();
      params.append('limit', '1000');
      if (after) params.append('after', after);

      const { data: membersChunk } = await discordApi
        .get(`/guilds/${GUILD_ID}/members?${params.toString()}`, {
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

    const members = allMembers;

    console.log(`Checking ${members.length} guild members for role fraud prevention`);

    // Get all role IDs that are managed by our system (from subscriptions)
    const managedRoleIds = new Set();
    for (const subscription of activeSubscriptions.values()) {
      managedRoleIds.add(subscription.role.id);
    }

    console.log(`Found ${managedRoleIds.size} managed roles to check`);

    const now = new Date();

    for (const member of members) {
      try {
        const memberRoles = member.roles || [];
        const hasManagedRole = memberRoles.some((roleId: string) => managedRoleIds.has(roleId));

        if (!hasManagedRole) continue;

        // Check if this member has an active subscription for any of their roles
        let hasActiveSubscription = false;
        for (const roleId of memberRoles) {
          if (managedRoleIds.has(roleId)) {
            const userSubscriptions = Array.from(activeSubscriptions.values()).filter(
              (sub) => sub.discordUserId === member.user.id && sub.role.id === roleId,
            );

            if (userSubscriptions.length > 0) {
              const latestSubscription = userSubscriptions.reduce((latest, sub) =>
                new Date(sub.expiresAt) > new Date(latest.expiresAt) ? sub : latest,
              );

              if (new Date(latestSubscription.expiresAt) > now) {
                hasActiveSubscription = true;
                break;
              }
            }
          }
        }

        if (!hasActiveSubscription) {
          console.log(`User ${member.user.id} has managed roles but no active subscription, removing roles`);

          for (const roleId of memberRoles) {
            if (managedRoleIds.has(roleId)) {
              await discordApi
                .delete(`/guilds/${GUILD_ID}/members/${member.user.id}/roles/${roleId}`, {
                  headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
                })
                .then(() => {
                  console.log(`Removed role ${roleId} from user ${member.user.id} (no active subscription)`);
                  return new Promise((resolve) => setTimeout(resolve, 100));
                })
                .catch((error) => {
                  console.error(`Failed to remove role ${roleId} from user ${member.user.id}: ${error}`);
                });
            }
          }
        }
      } catch (error) {
        console.error(`Error checking member ${member.user.id}: ${error}`);
      }
    }

    console.log('Finished checking users with roles for active subscriptions');
  } catch (error) {
    console.error('Error in checkUsersWithRoleForActiveSubscriptions:', error);
  }
}

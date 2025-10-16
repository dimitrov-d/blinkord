import { getSubscriptionsByGuildId, initializeDatabase } from '../database/database';
import env from '../services/env';
import { discordApi } from '../services/oauth';

const GUILD_ID = '925207817923743794'; // SOL Decoder

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
  } catch (error) {
    console.error('Error in purgeExpiredUsers:', error);
  }
}

// Run the script
purgeExpiredUsers();

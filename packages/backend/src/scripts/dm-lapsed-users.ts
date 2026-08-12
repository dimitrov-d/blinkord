/**
 * Re-engagement DM campaign for lapsed Blinkord subscribers.
 *
 * Finds every Discord user whose subscription has expired and who no longer
 * holds any active subscription, then sends each one a single DM about the
 * new Valhalla platform and the special returning-member offer.
 *
 * Usage (from packages/backend):
 *   npm run dm-lapsed-users -- --dry-run
 *   npm run dm-lapsed-users
 */

import { initializeDatabase, getLapsedSubscriberUserIds } from '../database/database';
import { discordApi } from '../services/oauth';
import env from '../services/env';

const DM_EMBED = {
  color: 0x61d1aa,
  description: [
    "Hey! 👋 It looks like your Blinkord subscription has expired — but it's not too late to come back.",
    'We have a brand new website you can use with Valhalla - copy trading on Meteora has never been so hot!',
    '🔗 <https://valhalla-bot.vercel.app/>',
    '',
    'Special offer for returning members 🎉',
    'Open a ticket in our Discord and we will double your subscription time for free!',
    "We can also set you up with great wallets for Valhalla — just ask when you open the ticket and we'll hook you up.",
    "Here's what some of our community is saying:",
    ' <https://x.com/ch89nft/status/2083107499842863355?s=46&t=uqxKNRkv7bJZan5vgrS5pw>',
    ' <https://x.com/SteufDab/status/2083916138631586038?s=20>',
    'Hope to see you back! 🚀',
  ].join('\n'),
  image: {
    url: 'https://media.discordapp.net/attachments/948635337415090176/1536976218954534963/output-6mp1P7HqGi79sYSdeW1mCZDnTdEUAr4vHaYKPB5khRrc.jpg?ex=6a7d5c26&is=6a7c0aa6&hm=4ffa7d99c91d6f27302372e6f580cc3a93875159866ca02fc5b91f2b2f6ea71f&=&format=webp',
  },
};

async function sendDm(discordUserId: string): Promise<'sent' | 'skipped' | 'failed'> {
  try {
    const { data: dmChannel } = await discordApi.post(
      '/users/@me/channels',
      { recipient_id: discordUserId },
      { headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` } },
    );

    await discordApi.post(
      `/channels/${dmChannel.id}/messages`,
      { embeds: [DM_EMBED] },
      { headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` } },
    );

    return 'sent';
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 403 || status === 400) {
      // 403 = user has DMs disabled; 400 = cannot DM yourself / invalid recipient
      return 'skipped';
    }
    console.error(`Failed to DM user ${discordUserId}: ${error?.message ?? error}`);
    return 'failed';
  }
}

async function main() {
  const isDryRun = process.argv.includes('--dry-run');

  if (isDryRun) {
    console.info('[dry-run] No messages will be sent.');
  }

  await initializeDatabase();

  const userIds = await getLapsedSubscriberUserIds();
  console.info(`Lapsed subscribers found: ${userIds.length}`);

  if (isDryRun) {
    console.info('[dry-run] Would DM the following user IDs:');
    userIds.forEach((id) => console.info(`  ${id}`));
    return;
  }

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const userId of userIds) {
    const result = await sendDm(userId);

    if (result === 'sent') {
      sent += 1;
      console.info(`DM sent to ${userId}`);
    } else if (result === 'skipped') {
      skipped += 1;
      console.info(`Skipped ${userId} (DMs closed or invalid recipient)`);
    } else {
      failed += 1;
    }

    // Respect Discord rate limits (~50 DMs/sec global limit; 250 ms gives comfortable headroom)
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  console.info(`\nDone — sent: ${sent}, skipped: ${skipped}, failed: ${failed}`);
  if (failed > 0) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error('Fatal error in dm-lapsed-users:', error);
    process.exitCode = 1;
  })
  .finally(() => process.exit(process.exitCode ?? 0));

/**
 * Manual Discord reconciliation for a guild (or all limited-time guilds).
 *
 * Usage (from packages/backend):
 *   npm run purge-expired-users -- --dry-run
 *   npm run purge-expired-users -- --guild 925207817923743794
 *   npm run purge-expired-users -- --all
 *   npm run purge-expired-users
 */
import { initializeDatabase } from '../database/database';
import {
  DEFAULT_PURGE_GUILD_ID,
  purgeExpiredUsersForGuild,
  purgeExpiredUsersForLimitedTimeGuilds,
} from '../jobs/purge-expired-users';

function parseArgs(argv: string[]) {
  const args = argv.slice(2);
  let dryRun = false;
  let allGuilds = false;
  let guildId = process.env.PURGE_GUILD_ID || DEFAULT_PURGE_GUILD_ID;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--dry-run') {
      dryRun = true;
    } else if (arg === '--all') {
      allGuilds = true;
    } else if (arg === '--guild' || arg === '--guild-id') {
      const value = args[++i];
      if (!value) {
        throw new Error(`${arg} requires a guild id`);
      }
      guildId = value;
    } else if (arg.startsWith('--guild=')) {
      guildId = arg.slice('--guild='.length);
    }
  }

  return { dryRun, allGuilds, guildId };
}

async function main() {
  const { dryRun, allGuilds, guildId } = parseArgs(process.argv);

  await initializeDatabase();

  if (allGuilds) {
    const summaries = await purgeExpiredUsersForLimitedTimeGuilds({ dryRun });
    const failed = summaries.some((s) => s.pass1.failed > 0 || s.pass2.failed > 0);
    if (failed) process.exitCode = 1;
    return;
  }

  const summary = await purgeExpiredUsersForGuild(guildId, { dryRun });
  if (summary.pass1.failed > 0 || summary.pass2.failed > 0) {
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error('Fatal error in purge-expired-users:', error);
    process.exitCode = 1;
  })
  .finally(() => process.exit(process.exitCode ?? 0));

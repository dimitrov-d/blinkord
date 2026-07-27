import { schedule } from 'node-cron';
import { initializeDatabase } from '../database/database';
import { purgeExpiredUsersForLimitedTimeGuilds } from '../jobs/purge-expired-users';
import env from '../services/env';

/**
 * Weekly Discord reconciliation for all limited-time guilds.
 * Complements the hourly expiry cron by catching missed removals and orphaned roles.
 * Runs Sundays at 09:00 server time.
 */
schedule(
  '0 9 * * 0',
  async () => {
    if (env.NODE_ENV === 'development') return;

    console.info('Starting weekly purge-expired-users reconciliation');
    try {
      await initializeDatabase();
      await purgeExpiredUsersForLimitedTimeGuilds({ dryRun: false });
      console.info('Weekly purge-expired-users reconciliation finished');
    } catch (error) {
      console.error('Weekly purge-expired-users reconciliation failed:', error);
    }
  },
  { recoverMissedExecutions: true, runOnInit: false },
);

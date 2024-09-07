require('dotenv').config();

// Define the keys for the environment variables as a constant array
const envKeys = [
  'DISCORD_BOT_TOKEN',
  'DISCORD_CLIENT_ID',
  'DISCORD_CLIENT_SECRET',
  'DISCORD_REDIRECT_URI',
  'APP_BASE_URL',
  'SOLANA_RPC_URL',
  'JWT_SECRET',
  'DATABASE_HOST',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'BLINKSIGHTS_API_KEY',
  'ENCRYPTION_KEY',
] as const;

// Initialize the env object using a dynamic mapping based on env keys
const env = envKeys.reduce(
  (acc, key) => {
    acc[key] = process.env[key];
    return acc;
  },
  {} as Record<(typeof envKeys)[number], string>,
);

export default env;

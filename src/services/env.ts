require('dotenv').config();

// Environment variables populated from .env
const env = {
  DISCORD_BOT_TOKEN: null,
  DISCORD_CLIENT_ID: null,
  DISCORD_CLIENT_SECRET: null,
  DISCORD_REDIRECT_URI: null,

  APP_BASE_URL: null,
  DEFAULT_RECIPIENT: null,

  DATABASE_HOST: null,
  DATABASE_USER: null,
  DATABASE_PASSWORD: null,
};

Object.keys(env).forEach((key) => (env[key] = process.env[key]));

export default env;

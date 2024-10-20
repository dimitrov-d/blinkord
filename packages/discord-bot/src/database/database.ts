import 'reflect-metadata';
import { DataSource, Repository } from 'typeorm';
import { Wallet } from './entities/wallet';
import { encryptText } from '../services/crypto';
import { generateSolanaKeypair } from '../services/solana';
import { BotGuild } from './entities/bot-guild';

let walletRepository: Repository<Wallet>;
let botGuildRepository: Repository<BotGuild>;
export async function initializeDatabase() {
  const dataSource = new DataSource({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    schema: 'public',
    type: 'postgres',
    database: 'postgres',
    port: 5432,
    driver: require('pg'),
    entities: [Wallet, BotGuild],
  });
  await dataSource
    .initialize()
    .then(() => console.info('Database connected successfully'))
    .catch((err) => console.error('Error during database initialization', err));

  walletRepository = dataSource.getRepository(Wallet);
  botGuildRepository = dataSource.getRepository(BotGuild);
}

export function getUserWallet(discordUserId: string) {
  return walletRepository.findOne({ where: { discordUserId } });
}

export async function getOrCreateWallet(discordUserId: string) {
  // If this discord user already created a wallet, return the existing one
  const existingWallet = await getUserWallet(discordUserId);
  if (existingWallet) return existingWallet;

  const { publicKey, privateKey } = generateSolanaKeypair();
  const wallet = new Wallet(publicKey, discordUserId, await encryptText(privateKey));

  return await walletRepository.save(wallet);
}

export async function createBotGuild(botGuild: Partial<BotGuild>) {
  return await botGuildRepository.save(botGuild);
}

export function getBotGuild(guildId: string) {
  return botGuildRepository.findOne({ where: { id: guildId } });
}

export function modifyWhitelistedDomains(guildId: string, whitelistedDomains: string) {
  return botGuildRepository.update(guildId, { whitelistedDomains });
}

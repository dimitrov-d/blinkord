import 'reflect-metadata';
import { Repository, DataSource, InsertResult, UpdateResult, MoreThan, Between, Not, IsNull } from 'typeorm';
import { Guild } from './entities/guild';
import { Role } from './entities/role';
import env from '../services/env';
import { AccessToken } from './entities/access-token';
import { RolePurchase } from './entities/role-purchase';
import { Wallet } from './entities/wallet';

let dataSource: DataSource;

let guildRepository: Repository<Guild>;
let accessTokenRepository: Repository<AccessToken>;
let rolePurchaseRepository: Repository<RolePurchase>;
let walletRepository: Repository<Wallet>;
export async function initializeDatabase() {
  dataSource = new DataSource({
    host: env.DATABASE_HOST,
    username: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    schema: 'public',
    type: 'postgres',
    database: 'postgres',
    port: 5432,
    driver: require('pg'),
    entities: [Guild, Role, AccessToken, RolePurchase, Wallet],
    synchronize: false, // Set to true when you want to sync DB fields and tables with codebase
  });
  await dataSource
    .initialize()
    .then(() => console.info('Database connected successfully'))
    .catch((err) => console.error('Error during database initialization', err));

  guildRepository = dataSource.getRepository(Guild);
  accessTokenRepository = dataSource.getRepository(AccessToken);
  rolePurchaseRepository = dataSource.getRepository(RolePurchase);
  walletRepository = dataSource.getRepository(Wallet);
}

export async function findAllGuildIdsSortedByCreateTime(): Promise<string[]> {
  const guilds = await guildRepository
    .createQueryBuilder('guild')
    .select('guild.id')
    .where('hidden = FALSE')
    .orderBy('guild.createTime', 'DESC')
    .getMany();

  return guilds.map(({ id }) => id);
}

export async function getAllGuilds(): Promise<Guild[]> {
  return await guildRepository.find();
}

export async function insertGuild(guild: Guild): Promise<InsertResult> {
  return await dataSource.transaction(async (entityManager) => {
    const newGuild = await entityManager.insert(Guild, guild);

    await Promise.all(
      guild.roles.map((role: Partial<Role>) =>
        // Make relation between new guild and role
        entityManager.insert(Role, new Role({ ...role, guild: new Guild({ id: guild.id }) })),
      ),
    );

    return newGuild;
  });
}

export async function updateGuild(guildId: string, guild: Guild): Promise<UpdateResult> {
  return await dataSource.transaction(async (entityManager) => {
    // roles property causes the update query to break
    const updatedGuild = await entityManager.update(Guild, guildId, { ...guild, roles: undefined });
    if (!guild.roles?.length) return;
    // Delete roles that are not in the updated guild.roles array
    const existingRoles = await entityManager.find(Role, { where: { guild: { id: guildId } } });
    const rolesToDelete = existingRoles.filter(
      (existingRole) => !guild.roles.map((role) => role.id).includes(existingRole.id),
    );
    await Promise.all(rolesToDelete.map((role) => entityManager.delete(Role, role.id)));

    // Save new roles or update existing ones
    await Promise.all(
      guild.roles.map((role: Partial<Role>) =>
        entityManager.save(Role, new Role({ ...role, guild: new Guild({ id: guild.id }) })),
      ),
    );

    return updatedGuild;
  });
}

export async function findGuildById(id: string) {
  const guild = await guildRepository.findOne({
    where: { id },
    relations: ['roles'],
  });
  if (!guild) return;

  guild.roles
    .sort((a, b) => a.amount - b.amount)
    // Trim trailing zeroes based on precision and remove decimal dot if integer
    .forEach((role) => {
      role.amount = (+role.amount).toFixed(5).replace(/(\.0+|(\.\d+?)0+)$/, '$2') as any;
    });
  // Convert to string for form parsing
  guild.limitedTimeQuantity = `${guild.limitedTimeQuantity}` as any;
  return guild;
}

export async function findAccessTokenByCode(code: string): Promise<AccessToken | undefined> {
  return await accessTokenRepository.findOne({
    where: { code, expiresAt: MoreThan(new Date()) },
  });
}

export async function saveNewAccessToken(authToken: AccessToken): Promise<AccessToken> {
  return await accessTokenRepository.save(authToken);
}

export async function saveRolePurchase(rolePurchase: RolePurchase) {
  await rolePurchaseRepository.insert(rolePurchase);
}

/**
 * Get all role purchases where guild and role is not null, guild.limitedTimeRoles is true
 * And based on expiresAt it expires in less than three days
 * @returns {Promise<RolePurchase[]>}
 */
export async function getExpiringRoles(): Promise<RolePurchase[]> {
  const now = new Date();
  // Subtract hour to avoid edge case where expiresAt is at the exact time or minutes are before current time
  now.setHours(now.getHours() - 1);
  const threeDaysFromNow = new Date(now);
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  // Add hour to avoid edge case where expiresAt is at the exact time or minutes are after current time
  threeDaysFromNow.setHours(threeDaysFromNow.getHours() + 2);

  return await rolePurchaseRepository
    .createQueryBuilder('rolePurchase')
    .leftJoinAndSelect('rolePurchase.guild', 'guild')
    .leftJoinAndSelect('rolePurchase.role', 'role')
    .where('rolePurchase.expiresAt <= :threeDaysFromNow', {
      threeDaysFromNow,
    })
    .andWhere('rolePurchase.expiresAt > :now', {
      now,
    })
    .andWhere('guild.id IS NOT NULL')
    .andWhere('role.id IS NOT NULL')
    // .andWhere('guild.limitedTimeRoles = true')
    .getMany();
}

/**
 * Get all role purchases for a given discordUserId, guildId, and roleId
 * @param {string} discordUserId
 * @param {string} guildId
 * @param {string} roleId
 * @returns {Promise<RolePurchase[]>}
 */
export async function getAllRolesForUser(
  discordUserId: string,
  guildId: string,
  roleId: string,
): Promise<RolePurchase[]> {
  return await rolePurchaseRepository.find({
    where: {
      discordUserId,
      guild: { id: guildId },
      role: { id: roleId },
    },
  });
}

export async function createUserWallet(discordUserId: string, address: string) {
  return await walletRepository.save(new Wallet(address, discordUserId));
}

/**
 * Get all subscriptions for a given guildId (server id) that have an expiration date
 * @param {string} guildId
 * @returns {Promise<RolePurchase[]>}
 */
export async function getSubscriptionsByGuildId(guildId: string): Promise<RolePurchase[]> {
  return await rolePurchaseRepository.find({
    where: {
      guild: { id: guildId },
    },
    relations: ['guild', 'role'],
    order: { createTime: 'DESC' },
  });
}

import 'reflect-metadata';
import { Repository, DataSource } from 'typeorm';
import { Guild } from './entities/guild';
import { Role } from './entities/role';
import env from '../services/env';

let guildRepository: Repository<Guild>;
let roleRepository: Repository<Role>;

export async function initializeDatabase() {
  const dataSource = new DataSource({
    host: env.DATABASE_HOST,
    username: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    schema: 'public',
    type: 'postgres',
    database: 'postgres',
    port: 5432,
    driver: require('pg'),
    entities: [Guild, Role],
    synchronize: false, // Set to true when you want to sync DB fields and tables with codebase
  });
  await dataSource
    .initialize()
    .then(() => console.info('Database connected successfully'))
    .catch((err) => console.error('Error during database initialization', err));

  guildRepository = dataSource.getRepository(Guild);
  roleRepository = dataSource.getRepository(Role);
}

export async function insertGuild(guild: Guild) {
  return await guildRepository.insert(guild);
}

export async function updateGuild(guildId: string, data: Guild) {
  return await guildRepository.update(guildId, data);
}

export async function saveRole(role: Role) {
  await roleRepository.save(role);
}

export async function findGuildById(id: string) {
  const guild = await guildRepository.findOne({
    where: { id },
    relations: ['roles'],
  });
  guild?.roles.sort((a, b) => a.amount - b.amount);
  return guild;
}

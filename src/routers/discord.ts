import express from 'express';
import { saveGuild, saveRole } from '../database/database';
import { Guild } from '../database/entities/guild';
import { Role } from '../database/entities/role';

export const discordRouter = express.Router();

discordRouter.post('/guild', async (req, res) => {
  const guild: Guild = req.body;
  try {
    await saveGuild(new Guild(guild));

    await Promise.all(guild.roles.map((role) => saveRole(new Role(role))));

    return res.status(201).json(guild);
  } catch (error) {
    console.error(`Error saving guild: ${error}`);
    return res.status(500).json({ message: `Failed to save guild and roles: ${error}` });
  }
});

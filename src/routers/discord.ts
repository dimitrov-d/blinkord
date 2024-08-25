import express from 'express';
import { saveGuild, saveRole } from '../database/database';
import { Guild } from '../database/entities/guild';
import { Role } from '../database/entities/role';
import { verifySignature } from '../services/transaction';

export const discordRouter = express.Router();

discordRouter.post('/guild', async (req, res) => {
  const { message, signature, address, guild } = req.body as {
    message: string; // The message which was signed
    signature: string; // The signature after signing the message
    address: string; // The address from the connected wallet on the client
    guild: Guild;
  };

  // Buffer.from(signature).toString('base64')
  if (!verifySignature(address, message, signature)) return res.status(401).send('Invalid signature');
  guild.address = address;

  try {
    await saveGuild(new Guild(guild));

    await Promise.all(guild.roles.map((role) => saveRole(new Role(role))));

    return res.status(201).json(guild);
  } catch (error) {
    console.error(`Error saving guild: ${error}`);
    return res.status(500).json({ message: `Failed to save guild and roles: ${error}` });
  }
});

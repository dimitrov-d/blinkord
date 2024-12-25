import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Guild } from '../database/entities/guild';
import { isCorrectSignature as isValidSignature } from '../services/transaction';
import env from '../services/env';

/**
 * Middleware to verify JWT token from Authorization header
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const verifyJwt = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token not provided' });

  try {
    req['user'] = jwt.verify(token, env.JWT_SECRET) as { userId: string; guildIds: string[] };
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  next();
};

/**
 * Middleware to verify message signature and wallet address ownership
 * @param {Request} req - body must be of type { message: string; signature: string; address: string; data: Guild; }
 * @param {Response} res
 * @param {NextFunction} next
 */
export const verifySignature = async (req: Request, res: Response, next: NextFunction) => {
  // Verify signature and ownership
  const { message, signature, address, data } = req.body as {
    message: string;
    signature: string;
    address: string;
    data: Guild;
  };

  if (!isValidSignature(address, message, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  if (!req['user']?.guildIds?.includes(data?.id)) {
    return res.status(403).json({ error: 'User is not an owner/admin of the guild' });
  }

  next();
};

/**
 * Middleware to check if the user is an owner/admin of the guild
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const checkGuildOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const guildId = req.params.guildId;

  if (!req['user']?.guildIds?.includes(guildId)) {
    return res.status(403).json({ error: 'User is not an owner/admin of the guild' });
  }

  next();
};

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Guild } from '../database/entities/guild';
import { verifySignature } from '../services/transaction';
import env from '../services/env';

/**
 * Middleware to verify JWT token and user ownership
 * @param {Request} req - body must be of type { message: string; signature: string; address: string; data: Guild; }
 * @param {Response} res
 * @param {NextFunction} next
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token not provided' });

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; guildIds: string[] };
    req['user'] = decoded;
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Verify signature and ownership
  const { message, signature, address, data } = req.body as {
    message: string;
    signature: string;
    address: string;
    data: Guild;
  };

  if (!verifySignature(address, message, signature)) {
    return res.status(401).json({ message: 'Invalid signature' });
  }

  if (!req['user'].guildIds?.includes(data?.id)) {
    return res.status(403).json({ message: 'User is not an owner/admin of the guild' });
  }

  next();
};

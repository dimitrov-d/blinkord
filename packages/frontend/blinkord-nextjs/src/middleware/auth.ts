import { Guild } from '@/database/entities/guild';
import { verifySignature } from '@/services/transaction';
import { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';
import env from '@/services/env';

/**
 * Middleware to verify JWT token and user ownership
 * @param {NextRequest} req - body must be of type { message: string; signature: string; address: string; data: Guild; }
 * @param {NextResponse} res
 * @param {NextFunction} next
 */
export const authenticate = async (req: NextRequest) => {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    console.error('Token not provided');
    return false;
  }
  try {
    const decoded = verify(token, env.JWT_SECRET) as { userId: string; guildIds: string[] };
    req['user'] = decoded;
  } catch (error) {
    console.error('Invalid JWT token');
    return false;
  }

  // Verify signature and ownership
  const { message, signature, address, data } = (await req.json()) as {
    message: string;
    signature: string;
    address: string;
    data: Guild;
  };

  if (!verifySignature(address, message, signature)) {
    console.error('Invalid signature');
    return false;
  }

  if (!req['user'].guildIds?.includes(data?.id)) {
    console.error('User is not an owner/admin of the guild');
    return false;
  }
};

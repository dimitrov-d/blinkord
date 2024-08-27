// pages/api/discord/callback.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { handleDiscordCallback } from '@/lib/actions/discord.actions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const code = req.query.code as string;
    const data = await handleDiscordCallback(code);

    // Here, you might want to store the token or session info
    res.status(200).json(data);
  } catch (error) {
    console.error("Failed to handle Discord callback", error);
    res.status(500).json({ error: 'Failed to handle Discord callback' });
  }
}

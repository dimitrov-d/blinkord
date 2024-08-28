import { NextRequest, NextResponse } from 'next/server';
import { getDiscordLoginUrl } from '@/lib/actions/discord.actions';

export async function POST(req: NextRequest) {
  try {
    const { owner } = await req.json();
    const url = await getDiscordLoginUrl(owner);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Failed to get Discord login URL', error);
    return NextResponse.json({ error: 'Failed to get Discord login URL' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}

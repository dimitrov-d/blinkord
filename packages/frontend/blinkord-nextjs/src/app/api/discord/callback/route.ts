import { NextRequest, NextResponse } from 'next/server';
import { handleDiscordCallback } from '@/lib/actions/discord.actions';

export async function GET(req: NextRequest) {
  try {
    console.log("Request URL:", req.url);
    const url = new URL(req.nextUrl.href);
    console.log("Parsed URL:", url.href);
    const code = url.searchParams.get('code');
    
    if (!code) {
      return NextResponse.json({ error: 'Missing code' }, { status: 400 });
    }

    const data = await handleDiscordCallback(code);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Failed to handle Discord callback", error);
    return NextResponse.json({ error: 'Failed to handle Discord callback', details: error.message }, { status: 500 });
  }
}

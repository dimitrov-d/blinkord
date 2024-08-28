import { createGuild } from '@/lib/actions/discord.actions';
import { authenticate } from '@/middleware/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (!authenticate(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { address, data } = await req.json();

    if (!data.name || !data.roles?.length) {
      console.error('Invalid guild data provided');
      return NextResponse.json({ error: 'Invalid guild data provided' }, { status: 400 });
    }

    data.address = address;
    console.info(`Going to create guild: ${JSON.stringify(data)}`);

    await createGuild(data);
    console.info(`Guild ${data.id} inserted successfully`);

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error saving guild', error);
    return NextResponse.json({ error: `Failed to save guild and roles` }, { status: 500 });
  }
}

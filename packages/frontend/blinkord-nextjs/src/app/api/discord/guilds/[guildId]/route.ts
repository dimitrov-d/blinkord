import { findGuildById } from '@/database/database';
import { editGuildData } from '@/lib/actions/discord.actions';
import { authenticate } from '@/middleware/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  if (!authenticate(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { address, data } = await req.json();
    const guildId = req.nextUrl.pathname.split('/').pop();

    if (!guildId) {
      console.error('Guild ID not provided');
      return NextResponse.json({ error: 'Guild ID not provided' }, { status: 400 });
    }

    const guild = await findGuildById(guildId);
    if (!guild) {
      console.error(`Guild with ID ${guildId} not found`);
      return NextResponse.json({ error: 'Guild not found' }, { status: 404 });
    }

    data.address = address;
    console.info(`Going to update guild: ${JSON.stringify(data)}`);

    await editGuildData(guildId, data);
    console.info(`Guild ${guildId} updated successfully`);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Error updating guild', error);
    return NextResponse.json({ error: `Failed to update guild and roles` }, { status: 500 });
  }
}

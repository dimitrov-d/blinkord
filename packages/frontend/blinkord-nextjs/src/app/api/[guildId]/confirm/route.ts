import { findGuildById } from '@/database/database';
import { withActionHeaders } from '@/middleware/action-headers';
import { getDiscordAccessToken, discordApi } from '@/services/oauth';
import { NextRequest, NextResponse } from 'next/server';
import { env } from 'process';

export const POST = withActionHeaders(async (req: NextRequest) => {
  const code = req.nextUrl.searchParams.get('code');
  const roleId = req.nextUrl.searchParams.get('roleId');
  const guildId = req.nextUrl.pathname.split('/').slice(-2, -1)[0];
  const { signature } = JSON.parse(await req.text()); // Assuming the request body is sent as text/plain

  if (!guildId || !roleId || !code) {
    return NextResponse.json(
      { error: `Invalid role purchase data: guildId=${guildId}, roleId=${roleId}` },
      { status: 400 },
    );
  }

  const guild = await findGuildById(guildId);
  if (!guild) return NextResponse.json({ error: 'Guild not found' }, { status: 404 });

  const role = guild.roles.find((r) => r.id === roleId);
  if (!role) return NextResponse.json({ error: 'Role not found' }, { status: 404 });

  try {
    const access_token = await getDiscordAccessToken(code as string);
    console.info(`Guild join access token obtained, adding member to the server with roles...`);

    const { data: user } = await discordApi.get('/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    await discordApi.put(
      `/guilds/${guildId}/members/${user.id}`,
      { access_token, roles: [roleId] },
      { headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` } },
    );

    await discordApi.put(
      `/guilds/${guildId}/members/${user.id}/roles/${roleId}`,
      {},
      { headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` } },
    );

    console.info(`Successfully added user ${user.username} to guild ${guild.name} with role ${role.name}`);

    return NextResponse.json({
      title: guild.name,
      icon: guild.iconUrl,
      description: `https://solscan.io/tx/${signature}`,
      label: `Role ${role.name} obtained`,
      type: 'completed',
    });
  } catch (error: any) {
    console.error('Error while adding member to guild', error);
    return NextResponse.json({
      title: guild.name,
      icon: guild.iconUrl,
      description: `https://solscan.io/tx/${signature}`,
      label: null,
      type: 'completed',
      error: {
        message: `An error occurred. Contact the server owner and present the transaction in the description`,
      },
    });
  }
});

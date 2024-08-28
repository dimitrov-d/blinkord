import { findGuildById } from '@/database/database';
import { NextRequest, NextResponse } from 'next/server';
import { env } from 'process';
import { Action } from '@solana/actions-spec';
import { withActionHeaders } from '@/middleware/action-headers';

const BASE_URL = env.APP_BASE_URL;

export const GET = withActionHeaders(async (req: NextRequest) => {
  const guildId = req.nextUrl.pathname.split('/').pop();
  const code = req.nextUrl.searchParams.get('code');

  const guild = await findGuildById(guildId);
  if (!guild) {
    return NextResponse.json({
      type: 'completed',
      links: { actions: [] },
      title: 'Not found',
      icon: 'https://agentestudio.com/uploads/post/image/69/main_how_to_design_404_page.png',
      description: 'Discord server not found',
    });
  }

  const payload: Action<'action'> = {
    type: 'action',
    label: null,
    title: guild.name,
    icon: guild.iconUrl,
    description: guild.description,
    links: {
      actions: guild.roles.map(({ id, name, amount }) => ({
        label: `${name} (${amount} SOL)`,
        href: `${BASE_URL}/api/guilds/${guildId}/buy?roleId=${id}&code=${code}`,
      })),
    },
    disabled: !code,
    error: code ? null : { message: `Discord login required, visit ${BASE_URL}/blinkord/${guildId}` },
  };

  return NextResponse.json(payload);
});

export const OPTIONS = GET;

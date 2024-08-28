import { createActionHeaders, createPostResponse } from '@solana/actions';
import { findGuildById } from '@/database/database';
import env from '@/services/env';
import { generateSendTransaction } from '@/services/transaction';
import { NextRequest, NextResponse } from 'next/server';
import { withActionHeaders } from '@/middleware/action-headers';

const BASE_URL = env.APP_BASE_URL;

export const POST = withActionHeaders(async (req: NextRequest) => {
  const code = req.nextUrl.searchParams.get('code');
  const roleId = req.nextUrl.searchParams.get('roleId');

  const guildId = req.nextUrl.pathname.split('/').slice(-2, -1)[0];
  const { account } = await req.json();

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
    const transaction = await generateSendTransaction(account, role.amount, guild);

    return NextResponse.json(
      await createPostResponse({
        fields: {
          transaction,
          message: `Buy role ${role.name} for ${role.amount} SOL`,
          links: {
            next: {
              type: 'post',
              href: `${BASE_URL}/api/guilds/${guildId}/confirm?roleId=${role.id}&code=${code}`,
            },
          },
        },
      }),
    );
  } catch (error: any) {
    console.error('Error during generating transaction', error);
    return NextResponse.json({ error: `Error during generating transaction: ${error}` }, { status: 500 });
  }
});

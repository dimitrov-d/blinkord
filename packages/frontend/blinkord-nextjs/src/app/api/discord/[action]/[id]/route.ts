import { NextRequest, NextResponse } from "next/server";
import {
  handleDiscordCallback,
  getGuildRoles,
  createOrEditGuild,
  patchGuild,
} from "@/lib/actions/discord.actions";
import { CreateBlinkRequest } from "@/lib/types";

export async function GET(request: NextRequest, { params }: { params: { action: string; id: string } }) {
  const { action, id } = params;

  switch (action) {
    case "guildRoles":
      try {
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) throw new Error('Missing token');
        const data = await getGuildRoles(id, token);
        return NextResponse.json(data);
      } catch (error: any) {
        console.error("Error fetching guild roles:", error);
        return NextResponse.json({ error: "Failed to fetch guild roles", details: error.message }, { status: 500 });
      }

    case "callback":
      try {
        const code = new URL(request.url).searchParams.get('code');
        if (!code) throw new Error('Missing code');
        const data = await handleDiscordCallback(code);
        return NextResponse.json(data);
      } catch (error: any) {
        console.error("Error in callback:", error);
        return NextResponse.json({ error: "Failed to handle Discord callback", details: error.message }, { status: 500 });
      }

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 404 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { action: string } }) {
  const { action } = params;

  if (action === "createOrEditGuild") {
    try {
      const token = request.headers.get('Authorization')?.split(' ')[1];
      if (!token) throw new Error('Missing token');

      const body = await request.json() as CreateBlinkRequest & { message: string; signature: string };
      const { message, signature, ...guildData } = body; // Destructure to get message, signature, and the rest as guildData

      const response = await createOrEditGuild(guildData, guildData.ownerWallet, message, signature, token);
      return NextResponse.json(response);
    } catch (error: any) {
      console.error("Error creating or editing guild:", error);
      return NextResponse.json({ error: "Failed to create or edit guild", details: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 404 });
}

export async function PATCH(request: NextRequest, { params }: { params: { action: string; id: string } }) {
  const { action, id } = params;

  if (action === "patchGuild") {
    try {
      const token = request.headers.get('Authorization')?.split(' ')[1];
      if (!token) throw new Error('Missing token');

      const body = await request.json() as CreateBlinkRequest & { message: string; signature: string };
      const { message, signature, ...guildData } = body; // Destructure to get message, signature, and the rest as guildData

      const response = await patchGuild(id, guildData, guildData.ownerWallet, message, signature, token);
      return NextResponse.json(response);
    } catch (error: any) {
      console.error("Error patching guild:", error);
      return NextResponse.json({ error: "Failed to patch guild", details: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 404 });
}

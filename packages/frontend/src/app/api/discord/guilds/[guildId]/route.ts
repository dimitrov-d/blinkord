import { NextRequest, NextResponse } from "next/server";
import { editGuild, getGuild } from "@/lib/actions/discord.actions";

export async function GET(
  req: NextRequest,
  { params }: { params: { guildId: string } }
) {
  try {
    const guildId = params.guildId;
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const guild = await getGuild(guildId, token);
    return NextResponse.json(guild);
  } catch (error) {
    console.error("Failed to get guild", error);
    return NextResponse.json({ error: "Failed to get guild" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { guildId: string } }
) {
  try {
    const guildId = params.guildId;
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestBody = await req.json();
    const guild = await editGuild(guildId, requestBody, token);
    return NextResponse.json(guild);
  } catch (error) {
    console.error("Failed to update guild", error);
    return NextResponse.json(
      { error: "Failed to update guild" },
      { status: 500 }
    );
  }
}

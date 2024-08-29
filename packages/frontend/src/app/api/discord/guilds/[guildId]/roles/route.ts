import { NextRequest, NextResponse } from "next/server";
import { getGuildRoles } from "@/lib/actions/discord.actions";

export async function GET(req: NextRequest, { params }: { params: { guildId: string } }, token: string) {
  try {
    const guildId = params.guildId;
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rolesData = await getGuildRoles(guildId, token);
    return NextResponse.json(rolesData);
  } catch (error) {
    console.error("Failed to get guild roles", error);
    return NextResponse.json(
      { error: "Failed to get guild roles" },
      { status: 500 }
    );
  }
}
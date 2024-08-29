import { createGuild } from "@/lib/actions/discord.actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestBody = await req.json();
    const guild = await createGuild(requestBody, token);
    return NextResponse.json(guild);
  } catch (error) {
    console.error("Failed to create guild", error);
    return NextResponse.json(
      { error: "Failed to create guild" },
      { status: 500 }
    );
  }
}

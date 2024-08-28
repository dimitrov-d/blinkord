import { NextRequest, NextResponse } from "next/server";
import { handleDiscordCallback } from "@/lib/actions/discord.actions";
export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");

    if (!code) {
      console.error("Missing OAuth code in the request");
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const data = await handleDiscordCallback(code);
    return NextResponse.json(data, { status: 200 });
    console.log("Callback data received:", data);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Failed to handle Discord callback", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

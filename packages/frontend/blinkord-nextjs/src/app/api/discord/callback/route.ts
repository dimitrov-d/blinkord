import { NextRequest, NextResponse } from "next/server";
import { handleDiscordCallback } from "@/lib/actions/discord.actions";

export async function GET(req: NextRequest) {
  try {
    console.log("Request URL:", req.url);

    // Directly use req.nextUrl to get searchParams, which is easier and less error-prone
    const code = req.nextUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    // Call your existing function to handle the OAuth callback
    const data = await handleDiscordCallback(code);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Failed to handle Discord callback", error);
    return NextResponse.json(
      { error: "Failed to handle Discord callback", details: error.message },
      { status: 500 }
    );
  }
}

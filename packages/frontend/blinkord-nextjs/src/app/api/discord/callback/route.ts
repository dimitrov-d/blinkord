import { NextRequest, NextResponse } from "next/server";
import { DISCORD_API_BASE_URL } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");

    if (!code) {
      console.error("Missing OAuth code in the request");
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    if (!DISCORD_API_BASE_URL) {
      console.error("DISCORD_API_BASE_URL is not defined");
      throw new Error("DISCORD_API_BASE_URL is not defined");
    }

    const apiUrl = `${DISCORD_API_BASE_URL}/discord/login/callback?code=${encodeURIComponent(code)}`;
    console.log(`Making request to: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Failed to handle callback: ${response.statusText}`);
      const errorText = await response.text(); // Capture any error response body for debugging
      console.error(`Error details: ${errorText}`);
      return NextResponse.json(
        { error: `Failed to handle callback: ${response.statusText}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("Callback data received:", data);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Failed to handle Discord callback", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

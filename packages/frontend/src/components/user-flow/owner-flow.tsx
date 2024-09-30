"use client";

import DiscordLogo3D from "../discord-3rf";
import { ResponsiveConnectDiscordScreen } from "./hero";

function OwnerFlow() {
  const handleConnectDiscord = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login?owner=true`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Failed to connect Discord", error);
    }
  };

  return (
    <>
      <ResponsiveConnectDiscordScreen onConnect={handleConnectDiscord} />
      <DiscordLogo3D />
    </>
  );
}

export default OwnerFlow;

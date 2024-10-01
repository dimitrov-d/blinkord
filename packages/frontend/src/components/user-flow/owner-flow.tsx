import { Hero } from "./hero";
import DiscordLogo3D from "../discord-3rf";

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
      <Hero onConnect={handleConnectDiscord} />
      <DiscordLogo3D />
    </>
  );
}

export default OwnerFlow;

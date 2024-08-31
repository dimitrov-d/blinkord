"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/contexts/zustand/userStore";
import { useSearchParams } from "next/navigation";
import LoadingSpinner from "../loading";
import DiscordLogo3D from "../discord-3rf";
import { ConnectDiscordScreen } from "./hero";

function SearchParamsHandler({
  handleCodeCallback,
  callbackHandled,
}: {
  handleCodeCallback: (code: string, searchParams: URLSearchParams) => void;
  callbackHandled: boolean;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code && !callbackHandled) {
      handleCodeCallback(code, searchParams);
    }
  }, [searchParams, callbackHandled, handleCodeCallback]);

  return null;
}

function OwnerFlow() {
  const [callbackHandled, setCallbackHandled] = useState(false);
  const router = useRouter();

  // Zustand store hooks
  const setToken = useUserStore((state) => state.setToken);
  const setUserData = useUserStore((state) => state.setUserData);
  const setDiscordConnected = useUserStore(
    (state) => state.setDiscordConnected
  );
  const setDiscordDisconnected = useUserStore(
    (state) => state.setDiscordDisconnected
  );

  const handleConnectDiscord = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/login?owner=true`,
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

  const handleCodeCallback = async (
    code: string,
    searchParams: URLSearchParams
  ) => {
    if (callbackHandled) return; // Prevent multiple calls

    const serverId = searchParams.get("state");
    if (serverId) {
      // Redirect to the Blink page
      return router.push(`${serverId}?code=${code}`);
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/login/callback?code=${encodeURIComponent(code)}`,
        { headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Discord API error:", errorData);
        throw new Error(
          `Discord API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("discordToken", data.token);
        setUserData(data);
        setDiscordConnected(true);

        // Default redirection for owners or other flows
        router.push("/servers");
      } else {
        console.warn("No token received in the response.");
      }
    } catch (error) {
      console.error("Error in handleCodeCallback:", error);
      setDiscordDisconnected(true);
    } finally {
      setCallbackHandled(true);
    }
  };

  return (
    <div className="flex flex-col">
      <main className="flex container mx-auto px-4 py-8 z-1">
        <Suspense
          fallback={
            <>
              <LoadingSpinner />
            </>
          }
        >
          <SearchParamsHandler
            handleCodeCallback={handleCodeCallback}
            callbackHandled={callbackHandled}
          />
        </Suspense>
        <ConnectDiscordScreen onConnect={handleConnectDiscord} />
        <DiscordLogo3D />
      </main>
    </div>
  );
}

export default OwnerFlow;

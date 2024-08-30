"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/contexts/zustand/userStore";
import { useSearchParams } from "next/navigation";
import LoadingSpinner from "../loading";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DiscordLogo3D from "../discord-3rf";
import { ConnectDiscordScreen } from "./hero";

function SearchParamsHandler({
  handleCodeCallback,
  callbackHandled,
}: {
  handleCodeCallback: (code: string) => void;
  callbackHandled: boolean;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code && !callbackHandled) {
      handleCodeCallback(code);
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
      const response = await fetch("/api/discord/getLoginUrl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Omit this body when a member goes to blinkord.com/guild_id and logs in
        body: JSON.stringify({ owner: true }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirects to Discord login
      }
    } catch (error) {
      console.error("Failed to connect Discord", error);
    }
  };

  const handleCodeCallback = async (code: string) => {
    try {
      const response = await fetch(
        `/api/discord/login/callback?code=${encodeURIComponent(code)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
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

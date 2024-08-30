"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/contexts/zustand/userStore";
import Image from "next/image";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/loading";

interface Guild {
  id: string;
  name: string;
  image: string | null;
  hasBot: boolean;
  roles?: { id: string; name: string }[];
}

export default function Servers() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [isFetchingGuilds, setIsFetchingGuilds] = useState(false);
  const router = useRouter();
  const setIsLoggedIn = useUserStore((state) => state.setDiscordConnected);
  const discordConnected = useUserStore((state) => state.discordConnected);
  const discordClientId = useUserStore((state) => state.discordClientId);

  useEffect(() => {
    if (discordConnected) {
      fetchGuilds();
    } else {
      router.push("/");
    }
  }, [discordConnected, router]);

  const fetchGuilds = async () => {
    setIsFetchingGuilds(true);
    const userData = useUserStore.getState().userData;

    if (userData?.guilds) {
      setGuilds(userData.guilds);
    }
    setIsFetchingGuilds(false);
  };

  const handleServerSelect = async (
    guildId: string,
    guildName: string,
    guildImage: string | null
  ) => {
    const token =
      useUserStore.getState().token || localStorage.getItem("discordToken");
    const setSelectedGuild = useUserStore.getState().setSelectedGuild;

    setSelectedGuild(guildId, guildName, guildImage);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${guildId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (data?.guild?.id) {
      router.push(`/servers/${guildId}/manage`);
    } else {
      router.push(`/servers/${guildId}/create`);
    }
  };

  const handleInstallBot = (serverId: string) => {
    const width = 700;
    const height = 700;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_BASE_URL!
    const redirectUri = encodeURIComponent(appUrl);

    const popup = window.open(
      `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=268435457&integration_type=0&scope=bot+applications.commands&redirect_uri=${redirectUri}&response_type=code&guild_id=${serverId}`,
      "discordAuthPopup",
      `width=${width},height=${height},top=${top},left=${left},resizable,scrollbars`
    );

    // Set up a listener to handle the redirect completion
    const popupInterval = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(popupInterval);
      } else {
        try {
          // Check if the popup has redirected to the desired URL
          if (popup.location.href.includes(appUrl)) {
            // Redirect main window to the desired location
            window.location.href = popup.location.href;

            // Close the popup
            popup.close();

            // Clear the interval
            clearInterval(popupInterval);
          }
        } catch (error) {
          // Cross-origin error expected until redirect occurs; safely ignored
        }
      }
    }, 100);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h1
        className="text-5xl font-bold text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Select a server
      </motion.h1>
      {isFetchingGuilds ? (
        <LoadingSpinner />
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {guilds.map((guild, index) => (
            <motion.div
              key={guild.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-auto border-0 overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-32 relative">
                  {guild.image ? (
                    <Image
                      src={guild.image}
                      alt=""
                      layout="fill"
                      objectFit="cover"
                      className="opacity-80 blur-sm"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-200 to-indigo-400" />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {guild.image ? (
                      <Image
                        src={guild.image}
                        alt={guild.name}
                        width={64}
                        height={64}
                        className="rounded-full border-2 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center text-white text-2xl font-bold border-2 border-white shadow-md">
                        {guild.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{guild.name}</h2>
                    <p className="text-sm text-gray-300">
                      {guild.hasBot ? "Bot Master" : "Owner"}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    className={`py-2 px-4 text-sm font-semibold transition-all duration-300 ${guild.hasBot
                      ? "bg-cyan-400 hover:bg-cyan-600 text-white"
                      : "bg-purple-500 hover:bg-purple-600 text-white"
                      }`}
                    onClick={() =>
                      guild.hasBot
                        ? handleServerSelect(guild.id, guild.name, guild.image)
                        : handleInstallBot(guild.id)
                    }
                  >
                    {guild.hasBot ? "Manage" : "Setup"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

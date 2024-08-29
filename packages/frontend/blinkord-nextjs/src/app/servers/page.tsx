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
    const token = useUserStore.getState().token || localStorage.getItem("discordToken");

    if (userData && userData.guilds && token) {
      try {
        const guildsData = await Promise.all(
          userData.guilds.map(async (guild: Guild) => {
            if (guild.hasBot) {
              const response = await fetch(`/api/discord/guilds/${guild.id}/roles`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              if (!response.ok) {
                if (response.status === 401) {
                  localStorage.removeItem("discordToken");
                  setIsLoggedIn(false);
                } else {
                  return { ...guild, roles: [] };
                }
              }

              const rolesData = await response.json();
              return { ...guild, roles: rolesData.roles };
            } else {
              return { ...guild, roles: [] };
            }
          })
        );
        setGuilds(guildsData);
      } catch (error) {
        console.error("Failed to fetch guilds or roles", error);
      } finally {
        setIsFetchingGuilds(false);
      }
    } else {
      setIsFetchingGuilds(false);
    }
  };

  const handleServerSelect = (serverId: string) => {
    const serverHasBot = guilds.find((guild) => guild.id === serverId)?.hasBot || false;
    if (serverHasBot) {
      router.push(`/servers/${serverId}/manage`);
    } else {
      router.push(`/servers/${serverId}/edit`);
    }
  };

  const handleInstallBot = (serverId: string) => {
    const width = 700;
    const height = 700;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
  
    const popup = window.open(
      `https://discord.com/oauth2/authorize?client_id=${discordClientId}&permissions=268435457&integration_type=0&scope=bot+applications.commands&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&guild_id=${serverId}`,
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
          if (popup.location.href.includes("http://localhost:3000")) {
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
                    className={`py-2 px-4 text-sm font-semibold transition-all duration-300 ${
                      guild.hasBot 
                        ? "bg-cyan-400 hover:bg-cyan-600 text-white" 
                        : "bg-purple-500 hover:bg-purple-600 text-white"
                    }`}
                    onClick={() => guild.hasBot ? handleServerSelect(guild.id) : handleInstallBot(guild.id)}
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
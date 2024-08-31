"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/contexts/zustand/userStore";
import Image from "next/image";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/loading";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { GridPattern } from "@/components/ui/grid-pattern";
import { ThemeContext } from "@/lib/contexts/ThemeProvider";

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
  const { isDark } = useContext(ThemeContext);

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
      setGuilds(userData.guilds.sort((a: any, b: any) => a.name.localeCompare(b.name)));
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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${guildId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

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
    const appUrl = process.env.NEXT_PUBLIC_APP_BASE_URL!;
    const redirectUri = encodeURIComponent(`${appUrl}/redirect`);

    const popup = window.open(
      `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=268435457&integration_type=0&scope=bot+applications.commands&redirect_uri=${redirectUri}&response_type=code&guild_id=${serverId}`,
      "discordAuthPopup",
      `width=${width},height=${height},top=${top},left=${left},resizable,scrollbars`
    );

    const popupInterval = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(popupInterval);
      } else {
        try {
          if (popup.location.href.includes(appUrl)) {
            window.location.href = popup.location.href;
            popup.close();
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
        <p className="text-sm text-muted-foreground text-center mt-4">
          Please choose a server you want to create a blink for.
        </p>
        <p className="text-sm text-muted-foreground text-center mt-4">
          The Blinkord Bot will be added to your server in order to assign roles
          to your members.
        </p>
      </motion.h1>
      {isFetchingGuilds ? (
        <LoadingSpinner />
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full justify-center text-center"
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
              className="flex justify-center"
            >
              {isDark ? (
                <SpotlightCard
                  key={index}
                  hsl
                  hslMin={200}
                  hslMax={280}
                  from="rgba(255,255,255,0.20)"
                  mode="after"
                  size={400}
                  className="group w-72 rounded-2xl border-2 border-gray-700 bg-zinc-900"
                >
                  <div className="absolute inset-px rounded-[calc(var(--radius)-1px)] bg-black/10"></div>

                  <div className="h-32 relative rounded">
                    {guild.image ? (
                      <Image
                        src={guild.image}
                        alt=""
                        layout="fill"
                        objectFit="cover"
                        className="opacity-80 blur-sm rounded"
                      />
                    ) : (
                      <>
                          <div className="w-full h-full bg-gradient-to-br from-cyan-200 to-indigo-400 rounded" />
                      <span className="absolute inset-x-0 z-1 bottom-0 h-2  bg-gradient-to-r from-green-400 via-blue-600 to-purple-700"></span>

                      </>
                  
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded" />
                    <div className="absolute inset-0 flex items-center justify-center">
                    <span className="absolute inset-x-0 z-1 bottom-0 h-2  bg-gradient-to-r from-green-400 via-blue-600 to-purple-700"></span>
                      {guild.image ? (
                        <Image
                          src={guild.image}
                          alt={guild.name}
                          width={64}
                          height={64}
                          className="rounded-full border-2 border-neon-cyan shadow-md"
                        />
                        
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center text-white text-2xl font-bold border-2 border-white shadow-md">
                          {guild.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4 relative">
                    <GridPattern
                      offsetX={0}
                      offsetY={0}
                      size={64}
                      className="absolute -inset-x-0.5 -top-1/4 h-[150%] w-full skew-y-12 stroke-gray-600 stroke-[2] [mask-image:radial-gradient(black,transparent_70%)]"
                    >
                      {[1, 2, 3].map((_, i) => (
                        <GridPattern.Block
                          key={i}
                          row={1 + i}
                          column={i * 2}
                          className="fill-black/5 transition duration-500 hover:fill-black/10"
                        />
                      ))}
                    </GridPattern>

                    <div className="relative font-display text-4xl font-bold">
                      <div className="mb-8">
                        <h2 className="text-xl font-semibold text-white">
                          {guild.name}
                        </h2>
                        <p className="text-sm text-gray-400">
                          {guild.hasBot ? "Bot Master" : "Owner"}
                        </p>
                      </div>
                    </div>
                    <div className="relative bottom-0 right-0 z-0 flex justify-center">
                      <Button
                        variant="secondary"
                        className={`py-2 px-4 text-sm font-semibold transition-all duration-300 ${guild.hasBot
                          ? "bg-cyan-400 hover:bg-cyan-600 text-white"
                          : "bg-purple-500 hover:bg-purple-600 text-white"
                          }`}
                        onClick={() =>
                          guild.hasBot
                            ? handleServerSelect(
                              guild.id,
                              guild.name,
                              guild.image
                            )
                            : handleInstallBot(guild.id)
                        }
                      >
                        {guild.hasBot ? "Manage" : "Setup"}
                      </Button>
                    </div>
                  </CardContent>
                </SpotlightCard>
              ) : (
                <SpotlightCard
                  key={index}
                  hsl
                  hslMin={200}
                  hslMax={280}
                  from="rgba(255,255,255,0.20)"
                  mode="after"
                  size={400}
                  className="group w-72 rounded-2xl border-2 border-gray-200 bg-white"
                >
                  <div className="absolute inset-px rounded-[calc(var(--radius)-1px)] bg-white"></div>

                  <div className="h-32 relative rounded">
                    {guild.image ? (
                      <Image
                        src={guild.image}
                        alt=""
                        layout="fill"
                        objectFit="cover"
                        className="opacity-80 blur-sm rounded"
                      />
                    ) : (
                      <>
                          <div className="w-full h-full bg-gradient-to-br from-cyan-200 to-indigo-400 rounded" />
                      <span className="absolute inset-x-0 z-1 bottom-0 h-2  bg-gradient-to-r from-green-400 via-blue-600 to-purple-700"></span>

                      </>
                  
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded" />
                    <div className="absolute inset-0 flex items-center justify-center">
                    <span className="absolute inset-x-0 z-1 bottom-0 h-2  bg-gradient-to-r from-green-400 via-blue-600 to-purple-700"></span>
                      {guild.image ? (
                        <Image
                          src={guild.image}
                          alt={guild.name}
                          width={64}
                          height={64}
                          className="rounded-full border-2 border-neon-cyan shadow-md"
                        />
                        
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center text-white text-2xl font-bold border-2 border-white shadow-md">
                          {guild.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4 relative">
                    <GridPattern
                      offsetX={0}
                      offsetY={0}
                      size={64}
                      className="absolute -inset-x-0.5 -top-1/4 h-[150%] w-full skew-y-12 stroke-gray-200 stroke-[2] [mask-image:radial-gradient(black,transparent_70%)]"
                    >
                      {[1, 2, 3].map((_, i) => (
                        <GridPattern.Block
                          key={i}
                          row={1 + i}
                          column={i * 2}
                          className="fill-black/5 transition duration-500 hover:fill-black/10"
                        />
                      ))}
                    </GridPattern>

                    <div className="relative font-display text-4xl font-bold">
                      <div className="mb-8">
                        <h2 className="text-xl font-semibold">
                          {guild.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {guild.hasBot ? "Bot Master" : "Owner"}
                        </p>
                      </div>
                    </div>
                    <div className="relative bottom-0 right-0 z-0 flex justify-center">
                      <Button
                        variant="secondary"
                        className={`py-2 px-4 text-sm font-semibold transition-all duration-300 ${guild.hasBot
                          ? "bg-cyan-400 hover:bg-cyan-600 text-white"
                          : "bg-purple-500 hover:bg-purple-600 text-white"
                          }`}
                        onClick={() =>
                          guild.hasBot
                            ? handleServerSelect(
                              guild.id,
                              guild.name,
                              guild.image
                            )
                            : handleInstallBot(guild.id)
                        }
                      >
                        {guild.hasBot ? "Manage" : "Setup"}
                      </Button>
                    </div>
                  </CardContent>
                </SpotlightCard>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

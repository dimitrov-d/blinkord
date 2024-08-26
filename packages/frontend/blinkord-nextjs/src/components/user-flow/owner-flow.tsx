"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogIn } from "lucide-react";
import { mockServers } from "@/lib/mock-data/index";

export default function OwnerFlow() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [discordConnected, setDiscordConnected] = useState(false);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [hasBot, setHasBot] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (hasBot && selectedServer) {
      router.push(`/${selectedServer}/manage`);
    } else if (selectedServer && !hasBot) {
      router.push(`/${selectedServer}/edit`);
    }
  }, [hasBot, selectedServer, router]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleConnectDiscord = () => {
    setDiscordConnected(true);
  };

  const handleServerSelect = (serverId: string) => {
    setSelectedServer(serverId);
    const serverHasBot =
      mockServers.find((server) => server.id === serverId)?.hasBot || false;
    setHasBot(serverHasBot);
  };

  return (
    <div className="flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        {!isLoggedIn ? (
          <div className="text-center">
            <p className="mb-4">
              Create shareable links for premium Discord channels.
            </p>
            <div className="flex flex-row items-center justify-center gap-8">
              <div className="flex flex-col md:flex-row justify-start  items-center py-4"></div>
              <button
                onClick={handleLogin}
                className="w-full btn glow-on-hover flex items-center justify-center"
              >
                Get Started
              </button>
            </div>
          </div>
        ) : !discordConnected ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Connect Discord</h2>
            <p className="mb-4">
              To continue, you need to connect your Discord account.
            </p>

            <div className="flex flex-row items-center justify-center gap-8">
              <div className="flex flex-col md:flex-row justify-start  items-center py-4"></div>
              <button
                onClick={handleConnectDiscord}
                className="w-full btn glow-on-hover flex items-center justify-center"
              >
                <LogIn className="mr-2 h-4 w-4" /> Connect Discord
              </button>
            </div>
          </div>
        ) : !selectedServer ? (
          <div>
            <h2 className="text-3xl font-bold mb-8">Select a server</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockServers && mockServers.length > 0 ? (
                mockServers.map((server) => (
                  <Card
                    key={server.id}
                    className="overflow-hidden bg-gray-800 border-0"
                  >
                    <CardContent className="p-0">
                      <div className="aspect-video relative">
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${server.bgImage})`,
                            opacity: 0.3,
                          }}
                          aria-hidden="true"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img
                            src={server.icon || "/default-icon.png"}
                            alt={`${server.name} icon`}
                            className="w-16 h-16 rounded-full border-4 border-white"
                          />
                        </div>
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {server.name}
                          </h3>
                          <p className="text-sm text-gray-400">{server.role}</p>
                        </div>
                        <Button
                          variant="secondary"
                          className="bg-gray-700 hover:bg-gray-600"
                          onClick={() => handleServerSelect(server.id)}
                        >
                          {server.hasBot ? "Go" : "Setup"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p>No servers available.</p>
              )}
            </div>
          </div>
        ) : (
          <p>Redirecting...</p> // Placeholder while redirecting
        )}
      </main>
    </div>
  );
}

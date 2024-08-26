"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockBots } from "@/lib/mock-data";

export default function ManageBotsPage() {
  const { serverId } = useParams();
  const [bots, setBots] = useState<
    { id: string; name: string; status: string }[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch bots associated with this serverId and populate the bots state
    // This is a mock; replace with an actual API call to fetch bot data
    const mockBotsData = mockBots.filter(
      (bot: any) => bot.serverId === serverId
    );
    setBots(mockBotsData);
  }, [serverId]);

  const handleManageBot = (botId: string) => {
    // Redirect to the bot management page or perform actions like restart, delete, etc.
    router.push(`/${serverId}/manage/${botId}`);
  };

  return (
    <div className="container mx-auto py-8 px-4 mt-20 max-w-7xl">
      <h1 className="text-3xl font-bold mb-4">
        Manage Bots for Server: {serverId}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bots.length > 0 ? (
          bots.map((bot) => (
            <Card key={bot.id} className="bg-gray-800 text-white">
              <CardContent className="p-4">
                <h3 className="text-xl font-bold">{bot.name}</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Status: {bot.status}
                </p>
                <Button
                  onClick={() => handleManageBot(bot.id)}
                  className="w-full"
                >
                  Manage Bot
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No bots available to manage for this server.</p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockBots } from "@/lib/mock-data";

export default function ManageBotPage() {
  const { serverId, botId } = useParams<{ serverId: string; botId: string }>();
  const [botData, setBotData] = useState<{
    id: string;
    name: string;
    status: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch bot details based on botId and populate botData state
    // This is a mock; replace with an actual API call to fetch bot data
    const bot = mockBots.find((b) => b.id === botId && b.serverId === serverId);
    if (bot) {
      setBotData(bot);
    } else {
      router.push(`/${serverId}/manage`); // Redirect if bot not found
    }
  }, [botId, serverId, router]);

  const handleRestartBot = () => {
    // Implement the logic to restart the bot
    alert(`Restarting bot: ${botData?.name}`);
  };

  const handleDeleteBot = () => {
    // Implement the logic to delete the bot
    alert(`Deleting bot: ${botData?.name}`);
    router.push(`/${serverId}/manage`);
  };

  if (!botData) {
    return <p>Loading bot details...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        Manage Bot: {botData.name} (ID: {botId})
      </h1>
      <Card className="bg-gray-800 text-white">
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-4">Bot Details</h2>
          <p>Status: {botData.status}</p>
          <div className="mt-4 flex gap-4">
            <Button onClick={handleRestartBot} className="bg-blue-500">
              Restart Bot
            </Button>
            <Button onClick={handleDeleteBot} className="bg-red-500">
              Delete Bot
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

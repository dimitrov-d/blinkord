"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { BotIcon, CopyIcon, EyeIcon } from "lucide-react";
import { useWalletActions } from "@/lib/hooks/useWalletActions";
import { useWallet } from "@solana/wallet-adapter-react";
import { DiscordRole } from "@/lib/types";
import {
  fetchRoles,
  generateCustomUrl,
  handleSaveConfiguration,
} from "@/lib/actions/discord.actions";
import { useToast } from "@/components/ui/use-toast";
import {
  MotionCard,
  MotionCardContent,
  MotionInput,
  MotionButton,
} from "@/components/motion";
import { motion } from "framer-motion";
import { useUserStore } from "@/lib/contexts/zustand/userStore";
import { Skeleton } from "@/components/ui/skeleton";
import { BlinkPreview } from "@/components/blink/blink-display";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ManageServerPage() {
  const { serverId } = useParams();
  const [discordRoles, setDiscordRoles] = useState<DiscordRole[]>([]);
  const [botInstalled, setBotInstalled] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [showBlinkPreview, setShowBlinkPreview] = useState(false);
  const router = useRouter();
  const token =
    useUserStore((state) => state.token) ||
    localStorage.getItem("discordToken");
  const discordClientId = useUserStore((state) => state.discordClientId);
  const [loading, setLoading] = useState({
    roles: true,
    botStatus: true,
    customUrl: true,
    serverName: true,
  });
  const { toast } = useToast();
  const { wallet, signMessage } = useWalletActions();
  const selectedGuildName = useUserStore((state) => state.selectedGuildName);
  const selectedGuildId = useUserStore((state) => state.selectedGuildId);

  if (!selectedGuildId) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-full max-w-7xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">
              No <span className="highlight-cyan">Blinkord</span> Servers Set Up
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="mb-6 flex justify-center">
              <Image
                src="/bueno.png"
                alt="No Blinkord Guild Selected"
                width={200}
                height={200}
                className="rounded-full"
              />
            </div>
            <p className="text-gray-600 text-center max-w-md">
              You haven't created Discord paid roles for your server{" "}
              <span className="font-semibold">{selectedGuildName}</span>. Please
              go back and create a paid role in{" "}
              <span className="highlight-cyan">Create Paid Roles</span> or go
              back to the Servers page to select a guild to manage.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/servers")}>
              Go Back to Servers
            </Button>
          </CardFooter>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      if (typeof serverId === "string") {
        try {
          await Promise.all([
            fetchRoles(serverId, setDiscordRoles),
            generateCustomUrl(serverId, setCustomUrl),
          ]);
        } catch (error) {
          console.error("Error fetching data:", error);
          toast({
            title: "Error",
            description: "Failed to fetch server data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoading({
            roles: false,
            botStatus: false,
            customUrl: false,
            serverName: false,
          });
        }
      }
    };

    fetchData();
  }, [serverId, toast]);

  const toggleBlinkPreview = () => {
    setShowBlinkPreview((prev) => !prev);
  };

  const handleDiscordRolePriceChange = (
    discordRoleId: string,
    price: number
  ) => {
    setDiscordRoles((prevDiscordRoles) =>
      prevDiscordRoles.map((discordRole) =>
        discordRole.id === discordRoleId
          ? { ...discordRole, price }
          : discordRole
      )
    );
  };

  const handleDiscordRoleToggle = (discordRoleId: string) => {
    setDiscordRoles((prevDiscordRoles) =>
      prevDiscordRoles.map((discordRole) =>
        discordRole.id === discordRoleId
          ? { ...discordRole, enabled: !discordRole.enabled }
          : discordRole
      )
    );
  };

  const copyCustomUrl = () => {
    navigator.clipboard.writeText(customUrl);
    toast({
      title: "URL Copied!",
      description: "Custom URL has been copied to clipboard.",
    });
  };

  // Check if guild is configured
  if (!serverId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 text-center"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold"
        >
          No Server Configured
        </motion.h1>
        <p className="text-gray-600">
          It seems like you don't have a server configured yet. Please go back
          to the Create Paid Roles tab to set up your server.
        </p>
        <Button
          onClick={() => router.push("/servers/create")}
          variant="secondary"
          className="mt-4"
        >
          Go to Create Paid Roles
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl font-bold"
      >
        Manage Server: {selectedGuildName}
      </motion.h1>

      {/* Main content in two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Blink Preview */}
        <MotionCard
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >

          <MotionCard
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <MotionCardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Your custom URL</h2>
              <Separator className="my-4" />
              {loading.customUrl ? (
                <div className="flex items-center justify-between">
                  <Skeleton className="h-10 w-3/4 mr-4" />
                  <Skeleton className="h-10 w-24" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <MotionInput
                    type="text"
                    value={customUrl}
                    readOnly
                    className="flex-grow mr-4"
                    whileFocus={{ scale: 1.05 }}
                  />
                  <MotionButton
                    onClick={copyCustomUrl}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CopyIcon className="mr-2 h-4 w-4" />
                    Copy URL
                  </MotionButton>
                </div>
              )}
            </MotionCardContent>
          </MotionCard>
        </MotionCard>

        {/* Right Column: Discord Roles Configuration */}
        <BlinkPreview
          serverId={Array.isArray(serverId) ? serverId[0] : serverId}
          code="123"
        />
      </div>
    </motion.div>
  );
}

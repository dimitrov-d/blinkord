"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CopyIcon, SquareArrowOutUpRight } from "lucide-react";
import { useWalletActions } from "@/lib/hooks/useWalletActions";
import { DiscordRole, RoleData } from "@/lib/types";
import {
  MotionCard,
  MotionCardContent,
  MotionInput,
  MotionButton,
} from "@/components/motion";
import { motion } from "framer-motion";
import { useUserStore } from "@/lib/contexts/zustand/userStore";
import { Skeleton } from "@/components/ui/skeleton";
import { BlinkDisplay } from "@/components/blink/blink-display";
import { toast } from "sonner";
import { defaultSchema, ServerFormData, serverFormSchema } from "@/lib/zod-validation";
import OverlaySpinner from "@/components/overlay-spinner";
import ServerFormEdit from "@/components/form/edit-guild";
import { useWallet } from "@solana/wallet-adapter-react";
import { z } from "zod";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchRoles } from "@/lib/actions/discord.actions";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import MySubscriptions from "./subscriptions";

export default function ConfigureServerPage() {
  const { serverId } = useParams<{ serverId: string }>();
  const serverIdStr = Array.isArray(serverId) ? serverId[0] : serverId;
  const { signMessage, promptConnectWallet } = useWalletActions();
  const [guildName, setGuildName] = useState("");
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [roleData, setRoleData] = useState<RoleData>({ blinkordRolePosition: -1, roles: [] });
  const [customUrl, setCustomUrl] = useState("");
  const wallet = useWallet();

  // Form data is set later when guild is fetched
  const [formData, setFormData] = useState<ServerFormData>({ ...defaultSchema, id: serverId });
  const [channels, setChannels] = useState<{ name: string; id: string }[]>([]);

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof ServerFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [guildFound, setGuildFound] = useState(false);
  const router = useRouter();
  const token =
    useUserStore((state) => state.token) ||
    localStorage.getItem("discordToken");

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchGuildData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${serverIdStr}`, {
          headers: { Authorization: `Bearer ${token}`, },
        });

        if (response.ok) {
          const { guild } = await response.json();

          if (guild) {
            setFormData({ ...guild });

            setGuildName(guild.name);

            // Map out the pre-selected roles to enable toggles
            const allRoles = await fetchRoles(serverIdStr)

            const mergedRoles = allRoles.roles.map((role: DiscordRole) => {
              const selectedRole = guild.roles.find((r: DiscordRole) => r.id === role.id);
              return selectedRole ? { ...role, price: selectedRole.amount, enabled: true, } : role;
            });

            setRoleData({ ...allRoles, roles: mergedRoles });

            setGuildFound(true); // Guild was found and data populated
            // Generate the custom URL
            const generatedUrl = `${window.location.origin}/${guild.id}`;
            setCustomUrl(generatedUrl);
          } else {
            setGuildFound(false); // Guild data was not found
          }
        } else {
          setGuildFound(false); // Failed to fetch guild data
        }

        // Fetch channels
        const channelsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${serverIdStr}/channels`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (channelsResponse.ok) {
          const channels = await channelsResponse.json();
          // Assuming channels is an array of channel objects with id and name
          setChannels(channels);
        } else {
          console.error("Failed to fetch channels");
        }
      } catch (error: any) {
        console.error("Error fetching guild data", error);
        setGuildFound(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (serverIdStr) {
      fetchGuildData();
    } else {
      setIsLoading(false);
      setGuildFound(false);
    }
  }, [serverIdStr, token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOverlayVisible(true);
    setErrorOccurred(false);
    setIsLoading(true);

    try {
      await promptConnectWallet();

      const validatedFormData = serverFormSchema.parse(formData);
      const message = `Confirm updating Blink for ${guildName}`
      const signature = await signMessage(message);

      if (signature) {
        const payload = {
          data: {
            ...validatedFormData,
            roles: roleData.roles
              .filter((role) => role.enabled)
              .map((role) => ({
                id: role.id,
                name: role.name,
                amount: role.price.toString(),
              })),
          },
          address: wallet.publicKey,
          message,
          signature,
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${serverIdStr}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          toast.success("Blink data updated successfully");

          const guild = await response.json();
          setFormData(guild);
        } else {
          toast.error("Error updating server");
          setErrorOccurred(true);
        }
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof ServerFormData, string>> = {};
        error.errors.forEach(
          (err: { path: string | any[]; message: string | undefined }) => {
            if (err.path.length) {
              const field = err.path[0];
              if (typeof field === "string" && field in formData) {
                errors[field as keyof ServerFormData] = err.message;
              }
            }
          }
        );
        setFormErrors(errors);
        console.log(errors);
        toast.error(`Please fix the form errors: ${Object.values(errors).join('\n')}`);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
      setOverlayVisible(false);
    }
  };

  const copyCustomUrl = () => {
    navigator.clipboard.writeText(customUrl);
    toast("URL Copied!");
  };

  const openCustomUrl = () => {
    window.open(customUrl, '_blank');
  }

  // Delay rendering until loading is complete and guildFound is determined
  if (isLoading) {
    return (
      <div>
        <OverlaySpinner />
      </div>
    );
  }

  if (!guildFound) {
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
              <img
                src="/bueno.png"
                alt="No Blinkord Guild Selected"
                width={200}
                height={200}
                className="rounded-full"
              />
            </div>
            <p className="text-gray-600 text-center max-w-md">
              You haven't created Discord paid roles for your server{" "}
              <span className="font-semibold">{guildName}</span>. Please
              go back and create a paid role in{" "}
              <span className="highlight-cyan">Create Paid Roles</span> or go
              back to the Servers page to select a server to configure.
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
        className="text-3xl font-bold ml-3"
      >
        Configure Blink for {guildName}
      </motion.h1>
      {overlayVisible && (
        <OverlaySpinner
          text="Submitting your blink configuration"
          error={errorOccurred}
        />
      )}
      <Tabs selectedIndex={activeTab} onSelect={(index: number) => setActiveTab(index)}>
        <TabList className="flex justify-center space-x-4 pb-4">
          <Tab
            className={`px-4 py-2 rounded border cursor-pointer flex items-center ${activeTab === 0 ? "bg-gray-400 text-black font-bold" : "bg-gray-200 text-black"
              }`}
          >
            <span className="mr-2">🔧</span> Configure
          </Tab>
          <Tab
            className={`px-4 py-2 rounded border cursor-pointer flex items-center ${activeTab === 1 ? "bg-gray-400 text-black font-bold" : "bg-gray-200 text-black"
              }`}
          >
            <span className="mr-2">📜</span> My Subscriptions
          </Tab>
        </TabList>

        <TabPanel>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MotionCard
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <MotionCardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Your custom Blink URL 🔗
                </h2>
                <Separator className="my-4" />
                {isLoading ? (
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-3/4 mr-4" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <MotionInput
                      type="text"
                      value={customUrl}
                      readOnly
                      className="flex-grow mb-4 sm:mb-0 sm:mr-4"
                      whileFocus={{ scale: 1.05 }}
                    />
                    <div className="flex flex-col sm:flex-row">
                      <MotionButton
                        className="mb-2 sm:mb-0 sm:mr-2"
                        onClick={copyCustomUrl}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <CopyIcon className="mr-2 h-4 w-4" />
                        Copy URL
                      </MotionButton>
                      <MotionButton
                        onClick={openCustomUrl}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <SquareArrowOutUpRight className="mr-2 h-4 w-4" />
                        Open URL
                      </MotionButton>
                    </div>
                  </div>
                )}
              </MotionCardContent>
              <ServerFormEdit
                formData={formData}
                setFormData={setFormData}
                roleData={roleData}
                setRoleData={setRoleData}
                formErrors={formErrors}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                channels={channels}
              />
            </MotionCard>
            <MotionCard
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <MotionCardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Blink Preview 👀</h2>
                <Separator className="my-4" />
                {isLoading ? (
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-3/4 mr-4" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                ) : (
                  <BlinkDisplay
                    serverId={Array.isArray(serverId) ? serverId[0] : serverId}
                  />
                )}
              </MotionCardContent>
            </MotionCard>
          </div>
        </TabPanel>

        <TabPanel>
          <MySubscriptions serverName={guildName} />
        </TabPanel>
      </Tabs>
    </motion.div>
  );
}

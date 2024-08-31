"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CopyIcon } from "lucide-react";
import { useWalletActions } from "@/lib/hooks/useWalletActions";
import { DiscordRole } from "@/lib/types";
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
import { toast } from "sonner";
import { ServerFormData, serverFormSchema } from "@/lib/zod-validation";
import OverlaySpinner from "@/components/overlay-spinner";
import ServerFormEdit from "@/components/form/edit-guild";
import { useWallet } from "@solana/wallet-adapter-react";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchRoles } from "@/lib/actions/discord.actions";

export default function ManageServerPage() {
  const { serverId } = useParams<{ serverId: string | string[] }>();
  const serverIdStr = Array.isArray(serverId) ? serverId[0] : serverId;
  const { signMessage, promptConnectWallet } = useWalletActions();
  const selectedGuildName = useUserStore((state) => state.selectedGuildName);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [discordRoles, setDiscordRoles] = useState<DiscordRole[]>([]);
  const [customUrl, setCustomUrl] = useState("");
  const wallet = useWallet();

  const [formData, setFormData] = useState<ServerFormData>({
    id: serverIdStr || "",
    name: "",
    iconUrl: "",
    description: "",
    roles: [],
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof ServerFormData, string>>
  >({});
  const [showBlinkPreview, setShowBlinkPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [guildFound, setGuildFound] = useState(false);
  const router = useRouter();
  const token =
    useUserStore((state) => state.token) ||
    localStorage.getItem("discordToken");

  useEffect(() => {
    const fetchGuildData = async () => {
      try {
        const response = await fetch(`/api/discord/guilds/${serverIdStr}`, {
          headers: { Authorization: `Bearer ${token}`, },
        });

        if (response.ok) {
          const { guild } = await response.json();

          if (guild) {
            setFormData({
              id: guild.id,
              name: guild.name,
              iconUrl: guild.iconUrl,
              description: guild.description,
              roles: guild.roles || [],
            });

            // Map out the pre-selected roles to enable toggles
            const allRoles = await fetchRoles(serverIdStr)

            const mergedRoles = allRoles.roles.map((role: DiscordRole) => {
              const selectedRole = guild.roles.find((r: DiscordRole) => r.id === role.id);
              return selectedRole ? { ...role, price: selectedRole.amount, enabled: true, } : role;
            });
            setDiscordRoles(mergedRoles);

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
      const message = JSON.stringify(formData);
      const signature = await signMessage(message);

      if (signature) {
        const payload = {
          data: {
            ...validatedFormData,
            roles: discordRoles
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

        const response = await fetch(`/api/discord/guilds/${serverIdStr}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          toast.success("Blink data updated successfully");
          setShowBlinkPreview(false);
          setShowBlinkPreview(true);
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
      {overlayVisible && (
        <OverlaySpinner
          text="Submitting your blink configuration"
          error={errorOccurred}
        />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <h2 className="text-2xl font-semibold mb-4">
                Your custom Blink URL
              </h2>
              <Separator className="my-4" />
              {isLoading ? (
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
            <ServerFormEdit
              formData={formData}
              setFormData={setFormData}
              DiscordRoles={discordRoles}
              setDiscordRoles={setDiscordRoles}
              formErrors={formErrors}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </MotionCard>
        </MotionCard>
        <MotionCard
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <MotionCardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Blink Preview</h2>
            <Separator className="my-4" />
            {isLoading ? (
              <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-3/4 mr-4" />
                <Skeleton className="h-10 w-24" />
              </div>
            ) : (
              <BlinkPreview
                serverId={Array.isArray(serverId) ? serverId[0] : serverId}
              />
            )}
          </MotionCardContent>
        </MotionCard>
      </div>
    </motion.div>
  );
}

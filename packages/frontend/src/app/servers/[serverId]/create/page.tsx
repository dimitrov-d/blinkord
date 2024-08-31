"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { BlinkDisplay } from "@/components/blink/blink-display";
import { BlinkCardSkeleton } from "@/components/skeletons/blink-skeleton";
import { ServerFormSkeleton } from "@/components/skeletons/server-form";
import { useWalletActions } from "@/lib/hooks/useWalletActions";
import { SaveIcon, ServerIcon } from "lucide-react";
import { z } from "zod";
import { useUserStore } from "@/lib/contexts/zustand/userStore";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { DiscordRole } from "@/lib/types/index";
import { fetchRoles } from "@/lib/actions/discord.actions";
import { ServerFormData, serverFormSchema } from "@/lib/zod-validation";
import { MotionCard, MotionCardContent } from "@/components/motion";
import ServerForm from "@/components/form";
import OverlaySpinner from "@/components/overlay-spinner";

export default function Panel() {
  const { serverId } = useParams<{ serverId: string }>();
  const { signMessage, promptConnectWallet } = useWalletActions();
  const selectedGuildName = useUserStore((state) => state.selectedGuildName);
  const selectedGuildImage = useUserStore((state) => state.selectedGuildImage);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);

  const [formData, setFormData] = useState<ServerFormData>({
    id: serverId || "",
    name: "",
    iconUrl: "",
    description: "",
    // details: "",
    roles: [],
    // address: "",
    // message: "",
    // signature: "",
  });
  const [DiscordRoles, setDiscordRoles] = useState<DiscordRole[]>([]);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof ServerFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const wallet = useWallet();

  useEffect(() => {
    if (selectedGuildName || selectedGuildImage) {
      setFormData((prev) => ({
        ...prev,
        name: selectedGuildName || prev.name,
        iconUrl: selectedGuildImage || prev.iconUrl,
      }));
    }
  }, [selectedGuildName, selectedGuildImage]);

  useEffect(() => {
    const fetchData = async () => {
      if (serverId) {
        try {
          await fetchRoles(serverId, setDiscordRoles);
        } catch (error) {
          console.error("Error fetching roles:", error);
          toast.error("Failed to fetch server roles");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [serverId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOverlayVisible(true);
    setErrorOccurred(false);
    setIsLoading(true);

    try {
      promptConnectWallet();
      // if (!formData.address) {
      //   toast.error("Please connect your wallet to proceed.");
      //   return;
      // }

      const validatedFormData = serverFormSchema.parse(formData);
      const message = JSON.stringify(formData);
      const signature = await signMessage(message);

      if (signature) {
        const payload = {
          data: {
            ...validatedFormData,
            roles: DiscordRoles.filter((role) => role.enabled).map((role) => ({
              id: role.id,
              name: role.name,
              amount: role.price.toString(),
            })),
          },
          address: wallet.publicKey,
          message,
          signature,
          // no need for base64 here?
          // signature: Buffer.from(signature, "base64").toString(),
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${useUserStore.getState().token || localStorage.getItem("discordToken")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (response.ok) {
          toast.success("Server created successfully");
          router.push(`/servers/${serverId}/success`);
          // I need to create this view for success
        } else {
          toast.error("Error creating server");
          setErrorOccurred(true);
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof ServerFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path.length) {
            const field = err.path[0];
            if (typeof field === "string" && field in formData) {
              errors[field as keyof ServerFormData] = err.message;
            }
          }
        });
        setFormErrors(errors);
        console.log(errors);
        toast.error("Please fix the form errors");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
      setOverlayVisible(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {overlayVisible && (
        <OverlaySpinner
          text="Submitting your blink configuration"
          error={errorOccurred}
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-2 mb-6"
      >
        <ServerIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-primary">
          Create a Blink for {selectedGuildName}
        </h1>
      </motion.div>
      <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
        <MotionCard
          className="flex-1"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader>
            <CardTitle>Blink Details</CardTitle>
          </CardHeader>
          <MotionCardContent>
            <ServerForm
              formData={formData}
              setFormData={setFormData}
              DiscordRoles={DiscordRoles}
              setDiscordRoles={setDiscordRoles}
              formErrors={formErrors}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </MotionCardContent>
        </MotionCard>
        {/* Blink Preview commented out */}
        {/* <MotionCard
          className="flex-1"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CardHeader>
            <CardTitle>Blink Preview</CardTitle>
          </CardHeader>
          <MotionCardContent>
            <Suspense fallback={<BlinkCardSkeleton />}>
              {isLoading ? (
                <BlinkCardSkeleton />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <BlinkMock />
                </motion.div>
              )}
            </Suspense>
          </MotionCardContent>
        </MotionCard> */}
      </div>
    </div>
  );
}

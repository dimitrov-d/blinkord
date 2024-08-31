"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ServerFormSkeleton } from "@/components/skeletons/server-form";
import { SaveIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ServerFormProps } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MotionCard,
  MotionCardContent,
  MotionInput,
  MotionTextarea,
  MotionNumberInput,
  MotionButton,
} from "@/components/motion";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

function ServerForm({
  formData,
  setFormData,
  DiscordRoles,
  setDiscordRoles,
  formErrors,
  onSubmit,
  isLoading,
}: ServerFormProps & { isLoading: boolean }) {
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const wallet = useWallet();

  const handleDiscordRoleToggle = (DiscordRoleId: string) => {
    const updatedRoles = DiscordRoles.map((DiscordRole) =>
      DiscordRole.id === DiscordRoleId
        ? { ...DiscordRole, enabled: !DiscordRole.enabled }
        : DiscordRole
    );
    setDiscordRoles(updatedRoles);

    const enabledRoles = updatedRoles
      .filter((role) => role.enabled)
      .map((role) => ({
        id: role.id,
        name: role.name,
        amount: role.price, // Changed to keep the type as string
      }));
    setFormData((prev) => ({ ...prev, roles: enabledRoles }));
  };

  const handleDiscordRolePriceChange = (
    DiscordRoleId: string,
    price: string
  ) => {
    const updatedRoles = DiscordRoles.map((DiscordRole) =>
      DiscordRole.id === DiscordRoleId ? { ...DiscordRole, price } : DiscordRole
    );

    setDiscordRoles(updatedRoles);

    const enabledRoles = updatedRoles
      .filter((role) => role.enabled)
      .map((role) => ({
        id: role.id,
        name: role.name,
        amount: price || "0",
      }));

    setFormData((prev) => ({ ...prev, roles: enabledRoles }));
  };

  if (isLoading) {
    return <ServerFormSkeleton />;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 flex-col">
      {/* Blink Title Field */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <MotionCardContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Label htmlFor="name">Blink Title</Label>
            <MotionInput
              id="name"
              placeholder="Enter a title for your blink"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            {formErrors.name && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-destructive text-sm mt-1"
              >
                {formErrors.name}
              </motion.p>
            )}
          </MotionCardContent>

          {/* Blink Image URL Field */}
          <MotionCardContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Label htmlFor="iconUrl">Blink Image URL</Label>
            <MotionInput
              id="iconUrl"
              placeholder="Enter an image URL for your blink"
              value={formData.iconUrl}
              onChange={(e) => handleInputChange("iconUrl", e.target.value)}
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            {formErrors.iconUrl && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-destructive text-sm mt-1"
              >
                {formErrors.iconUrl}
              </motion.p>
            )}
          </MotionCardContent>

          {/* Blink Description Field */}
          <MotionCardContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Label htmlFor="description">Blink Description</Label>
            <MotionTextarea
              id="description"
              placeholder="Enter blink description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            {formErrors.description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-destructive text-sm mt-1"
              >
                {formErrors.description}
              </motion.p>
            )}
          </MotionCardContent>
        </div>
        <div className="flex-1">
          {/* Roles Section */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <MotionCardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Configure Paid Roles
              </h2>
              <Separator className="my-4" />
              <ScrollArea className="max-h-80">
                {DiscordRoles.length > 0 ? (
                  DiscordRoles.map((DiscordRole) => (
                    <motion.div
                      key={DiscordRole.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between py-4 border-b last:border-b-0"
                    >
                      <div className="flex items-center">
                        <Switch
                          checked={DiscordRole.enabled}
                          onCheckedChange={() =>
                            handleDiscordRoleToggle(DiscordRole.id)
                          }
                          className="mr-4"
                        />
                        <h3 className="text-lg font-medium">
                          {DiscordRole.name}
                        </h3>
                      </div>
                      <div className="flex items-center">
                        <MotionNumberInput
                          type="text"
                          placeholder="0"
                          value={DiscordRole.price || ""}
                          onChange={(e) =>
                            handleDiscordRolePriceChange(
                              DiscordRole.id,
                              e.target.value
                            )
                          }
                          className="w-32 mr-2"
                          disabled={!DiscordRole.enabled}
                          whileFocus={{ scale: 1.02 }}
                          step="0.00000001"
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                        <span className="text-gray-600">SOL</span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-600">
                    No roles available for this server.
                  </p>
                )}
              </ScrollArea>
            </MotionCardContent>
          </MotionCard>
        </div>
      </div>
      {wallet.connected ? (
        <MotionButton
          type="submit"
          className="w-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SaveIcon className="mr-2 h-4 w-4" />
          Save
        </MotionButton>
      ) : (
        <div className="flex justify-center items-center w-full h-full">
          <WalletMultiButtonDynamic className="mymultibutton text-sm break-keep flex items-center justify-center text-white py-[18px] px-[36px] rounded-[120px]" />
        </div>
      )}
    </form>
  );
}

export default ServerForm;

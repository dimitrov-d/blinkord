'use client'

import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { ServerFormSkeleton } from "@/components/skeletons/server-form"
import { SaveIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { ServerFormProps } from '@/lib/types'
import { MotionCard, MotionCardContent, MotionInput, MotionTextarea, MotionButton } from "@/components/motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageUpload from "@/components/image-upload"
import { UploadIcon } from "lucide-react"
import { useBlinkStore } from "@/lib/contexts/zustand/blinkStore"

function ServerForm({
  DiscordRoles,
  setDiscordRoles,
  formErrors,
  onSubmit,
  isLoading,
}: ServerFormProps & { isLoading: boolean }) {
  const { formData, setFormData } = useBlinkStore();

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(field, value);
  };

  const handleDiscordRoleToggle = (DiscordRoleId: string) => {
    setDiscordRoles(prevDiscordRoles =>
      prevDiscordRoles.map(DiscordRole =>
        DiscordRole.id === DiscordRoleId ? { ...DiscordRole, enabled: !DiscordRole.enabled } : DiscordRole
      )
    );
  };

  const handleDiscordRolePriceChange = (DiscordRoleId: string, price: string) => {
    const numericPrice = parseFloat(price);
    if (!isNaN(numericPrice)) {
      setDiscordRoles(prevDiscordRoles =>
        prevDiscordRoles.map(DiscordRole =>
          DiscordRole.id === DiscordRoleId ? { ...DiscordRole, price: numericPrice } : DiscordRole
        )
      );
    }
  };

  if (isLoading) {
    return <ServerFormSkeleton />;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <MotionCardContent initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Label htmlFor="name">Blink Title</Label>
        <MotionInput
          id="name"
          placeholder="Enter a title for your blink"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        {formErrors.title && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-sm mt-1">
            {formErrors.title}
          </motion.p>
        )}
      </MotionCardContent>

      <MotionCardContent initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Label htmlFor="name">Blink Image URL</Label>
        <MotionInput
          id="name"
          placeholder="Enter an image URL for your blink"
          value={formData.iconUrl}
          onChange={(e) => handleInputChange("iconUrl", e.target.value)}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        {formErrors.iconUrl && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-sm mt-1">
            {formErrors.iconUrl}
          </motion.p>
        )}
      </MotionCardContent>

      <MotionCardContent initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
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
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-sm mt-1">
            {formErrors.description}
          </motion.p>
        )}
      </MotionCardContent>

      <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <MotionCardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Configure Paid Roles</h2>
          <Separator className="my-4" />
          {DiscordRoles.length > 0 ? (
            DiscordRoles.map((DiscordRole) => (
              <motion.div key={DiscordRole.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="flex items-center justify-between py-4 border-b last:border-b-0">
                <div className="flex items-center">
                  <Switch checked={DiscordRole.enabled} onCheckedChange={() => handleDiscordRoleToggle(DiscordRole.id)} className="mr-4" />
                  <h3 className="text-lg font-medium">{DiscordRole.name}</h3>
                </div>
                <div className="flex items-center">
                  <MotionInput type="number" placeholder="Price in SOL" value={DiscordRole.price || ''} onChange={(e) => handleDiscordRolePriceChange(DiscordRole.id, e.target.value)} className="w-32 mr-2" disabled={!DiscordRole.enabled} whileFocus={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }} />
                  <span className="text-gray-600">SOL</span>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-600">No roles available for this server.</p>
          )}
        </MotionCardContent>
      </MotionCard>


      <MotionButton type="submit" className="w-full" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <SaveIcon className="mr-2 h-4 w-4" />
        Save
      </MotionButton>
    </form>
  );
}

export default ServerForm;

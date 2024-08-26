"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { serverFormSchema, ServerFormData } from "@/lib/zod-validation";
import { Blink } from "@/components/blink/mock-blink";
import { mockServers } from "@/lib/mock-data/index";
import { BlinkCardSkeleton } from "@/components/skeletons/blink-skeleton";
import { signMessageWithPhantom, sendTransaction } from "@/lib/phantom";
import z from "zod";

function ServerForm({ formData, setFormData, formErrors, onSubmit }) {
  const handleInputChange = (
    field: keyof ServerFormData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
        />
        {formErrors.title && (
          <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
        )}
      </div>
      <div>
        <Textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
        {formErrors.description && (
          <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
        )}
      </div>
      <div>
        <Select
          value={formData.details}
          onValueChange={(value) => handleInputChange("details", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select details" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
        {formErrors.details && (
          <p className="text-red-500 text-sm mt-1">{formErrors.details}</p>
        )}
      </div>
      <div>
        <Select
          onValueChange={(value: string) =>
            handleInputChange("roles", [...formData.roles, value])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="role1">Role 1 - 0.5 SOL</SelectItem>
            <SelectItem value="role2">Role 2 - 1 SOL</SelectItem>
            <SelectItem value="role3">Role 3 - 1.5 SOL</SelectItem>
          </SelectContent>
        </Select>
        {formErrors.roles && (
          <p className="text-red-500 text-sm mt-1">{formErrors.roles}</p>
        )}
      </div>
      <Button type="submit">Submit and Connect Wallet</Button>
    </form>
  );
}

export default function EditServerPage() {
  const { serverId } = useParams<{ serverId: string }>();
  const [selectedServer, setSelectedServer] = useState<string | null>(
    serverId || null
  );
  const [formData, setFormData] = useState<ServerFormData>({
    title: "",
    description: "",
    details: "",
    roles: [],
  });
  const [formErrors, setFormErrors] = useState<Partial<ServerFormData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      serverFormSchema.parse(formData);
      const message = JSON.stringify(formData);
      const signature = await signMessageWithPhantom(message);

      if (signature) {
        const response = await sendTransaction({
          message,
          signature,
          address: "user-wallet-address",
          guildInfo: formData,
        });

        if (response.success) {
          router.push(`/${selectedServer}/success`);
        } else {
          alert("Error during setup");
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<ServerFormData> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0] as keyof ServerFormData] = err.message;
          }
        });
        setFormErrors(errors);
      }
    }
  };

  return (
    <div className="container mx-auto p-40">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-bold mb-4">Edit Server</h2>
          <ServerForm
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            onSubmit={handleSubmit}
          />
        </div>
        <div className="w-full md:w-1/2">
          <Suspense fallback={<BlinkCardSkeleton />}>
            {isLoading ? (
              <BlinkCardSkeleton />
            ) : (
              <div className="sticky top-4">
                <Blink
                  action={{
                    title: formData.title || "Your Blink Title",
                    description:
                      formData.description || "Your Blink Description",
                    fields:
                      formData.roles.length > 0
                        ? formData.roles
                        : ["Enter your name"],
                  }}
                  websiteText={
                    selectedServer
                      ? mockServers.find((s) => s.id === selectedServer)?.name
                      : "Your Website"
                  }
                />
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}

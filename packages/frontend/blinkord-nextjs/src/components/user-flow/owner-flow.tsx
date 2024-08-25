"use client";
import { useState } from "react";
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
import z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { LogIn, Info, Plus } from "lucide-react";
import { serverFormSchema, ServerFormData } from "@/lib/zod-validation";
import { Blink } from "@/components/blink/mock-blink";
import { mockServers } from "@/lib/mock-data/index";

export default function OwnerFlow() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [discordConnected, setDiscordConnected] = useState(false);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [botInstalled, setBotInstalled] = useState(false);
  const [formData, setFormData] = useState<ServerFormData>({
    title: "",
    description: "",
    details: "",
    roles: [],
  });
  const [formErrors, setFormErrors] = useState<Partial<ServerFormData>>({});

  const handleLogin = () => {
    // Mock Discord OAuth login
    setIsLoggedIn(true);
  };

  const handleConnectDiscord = () => {
    // Mock Discord connection
    setDiscordConnected(true);
  };

  const handleServerSelect = (serverId: string) => {
    setSelectedServer(serverId);
    setBotInstalled(false);
  };

  const handleInstallBot = () => {
    // Implement bot installation logic
    setBotInstalled(true);
  };

  const handleSubmit = () => {
    try {
      serverFormSchema.parse(formData);
      console.log("Form submitted:", formData);
      // Implement form submission and wallet connection logic here
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

  const handleInputChange = (
    field: keyof ServerFormData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        {!isLoggedIn ? (
          <div className="text-center">
            <p className="mb-4">
              Create shareable links for premium Discord channels.
            </p>
            <Button onClick={handleLogin} size="lg">
              Get Started
            </Button>
            <Button variant="outline" className="ml-2" size="lg">
              <Info className="mr-2 h-4 w-4" /> Learn More
            </Button>
          </div>
        ) : !discordConnected ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Connect Discord</h2>
            <p className="mb-4">
              To continue, you need to connect your Discord account.
            </p>
            <Button onClick={handleConnectDiscord} size="lg">
              <LogIn className="mr-2 h-4 w-4" /> Connect Discord
            </Button>
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
                            src={server.icon}
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
                          Setup
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
        ) : !botInstalled ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Install Blinkord Bot</h2>
            <p className="mb-4">
              To continue, you need to install the Blinkord bot to your server.
            </p>
            <Button onClick={handleInstallBot} size="lg">
              <Plus className="mr-2 h-4 w-4" /> Install Bot
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">Setup Your Server</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium mb-1"
                  >
                    Title
                  </label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter server title"
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.title}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium mb-1"
                  >
                    Description
                  </label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Enter server description"
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.description}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="details"
                    className="block text-sm font-medium mb-1"
                  >
                    Details
                  </label>
                  <Textarea
                    id="details"
                    value={formData.details}
                    onChange={(e) =>
                      handleInputChange("details", e.target.value)
                    }
                    placeholder="Enter detailed information about your server and roles"
                    rows={4}
                  />
                  {formErrors.details && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.details}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="roles"
                    className="block text-sm font-medium mb-1"
                  >
                    Roles
                  </label>
                  <Select
                    onValueChange={(value: string) =>
                      handleInputChange("roles", [...formData.roles, value])
                    }
                  >
                    <SelectTrigger id="roles">
                      <SelectValue placeholder="Select roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="role1">Role 1</SelectItem>
                      <SelectItem value="role2">Role 2</SelectItem>
                      <SelectItem value="role3">Role 3</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.roles && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.roles}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Submit and Connect Wallet
                </Button>
              </form>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">Preview</h2>
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
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

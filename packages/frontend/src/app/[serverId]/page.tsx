"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { BlinkDisplay } from "@/components/blink/blink-display";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";

export default function BlinkPage() {
  const searchParams = useSearchParams();
  const { serverId } = useParams<{ serverId: string }>();
  const code = searchParams.get("code") || "";

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!code) {
      const authenticateUser = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/login`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          const data = await response.json();
          if (data.url) {
            window.location.href = `${data.url}&state=${serverId}`;
          }
        } catch (error) {
          console.error("Failed to connect to Discord", error);
        }
      };

      authenticateUser();
    } else {
      setIsAuthenticated(true);
    }
  }, [code]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-6xl"
      >
        <div className="flex flex-col md:flex-row items-start space-y-8 md:space-y-0 md:space-x-8 mt-16">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  Welcome to Blinkord
                </CardTitle>
                <CardDescription className="text-center">
                  You're one step away from unlocking exclusive content and
                  features on your favorite Discord servers!
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="mt-8">
              <Image
                src="/helmet.svg"
                alt="Illustration"
                width={400}
                height={400}
                style={{ margin: 'auto' }}
                className="rounded-lg full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <Card className="w-full h-auto">
              <CardContent>
                {isAuthenticated ? (
                  <div className="mb-6">
                    <BlinkDisplay serverId={serverId} code={code} />
                  </div>
                ) : (
                  <Alert className="mb-4">
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Authentication Required</AlertTitle>
                    <AlertDescription>
                      Please authenticate with Discord to proceed with
                      purchasing premium access.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

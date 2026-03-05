"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
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
import { useWindowSize } from "@/lib/hooks/use-window-size";
import { Button } from "@/components/ui/button";
import NotFound from "../not-found";

interface RenewalRole {
  roleId: string;
  roleName: string;
  yourRate: number;
  currentRate: number;
  currency: string;
}

export default function BlinkPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { serverId } = useParams<{ serverId: string }>();
  const code = searchParams.get("code") || "";

  // If serverId is not valid discord server ID, redirect to not found page
  if (!/^\d{17,19}$/.test(serverId)) {
    return <NotFound />;
  }

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [renewalRoles, setRenewalRoles] = useState<RenewalRole[]>([]);

  const { width } = useWindowSize();

  const authenticateUser = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      const data = await response.json();
      if (data.url) window.location.href = `${data.url}&state=${serverId}`;
    } catch (error) {
      console.error("Failed to connect to Discord", error);
    }
  };

  const onConnect = () => {
    authenticateUser();
  };

  useEffect(() => {
    if (!code) {
      return;
    }
    const guildId = localStorage.getItem("state");

    if (guildId === serverId) {
      return setIsAuthenticated(true);
    }
    // If link was shared with code, use this measure to remove code from URL in case user did not log in yet
    const params = new URLSearchParams(window.location.search);
    params.delete("code");

    router.push(`${window.location.pathname}?${params.toString()}`);
  }, [code]);

  // Fetch grandfathered pricing info for returning subscribers
  useEffect(() => {
    if (!code) return;

    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/blinks/${serverId}/renewal-info?code=${code}`
    )
      .then((res) => (res.ok ? res.json() : { roles: [] }))
      .then((data) => {
        if (data.roles?.length > 0) setRenewalRoles(data.roles);
      })
      .catch(() => {});
  }, [code, serverId]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-6xl mt-6"
      >
        <div
          className={`flex flex-col ${width! >= 800 ? "md:flex-row" : ""
            } items-start space-y-8 md:space-y-0 md:space-x-8 mt-16`}
        >
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 w-full"
          >
            <Card className="w-full">
              <WelcomeText />

              {renewalRoles.length > 0 && (
                <CardContent>
                  <Alert className="border-amber-500/50 bg-amber-500/10">
                    <InfoIcon className="h-5 w-5" />
                    <AlertTitle className="text-amber-200 font-bold">
                      Grandfathered Rate Available!
                    </AlertTitle>
                    <AlertDescription className="mt-2">
                      <p className="mb-2 text-sm">
                        As a returning subscriber, you can renew at your original rate.
                        You have <strong>3 days after expiration</strong> to keep your price.
                        After that, the new price applies.
                      </p>
                      {renewalRoles.map((role) => (
                        <div key={role.roleId} className="flex items-center gap-2 text-sm mt-1">
                          <span className="font-semibold">{role.roleName}:</span>
                          <span className="text-green-400 font-bold">
                            {role.yourRate} {role.currency}
                          </span>
                          <span className="text-muted-foreground">
                            (new price: {role.currentRate} {role.currency})
                          </span>
                        </div>
                      ))}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              )}

              <div className="mt-8" style={{ textAlign: "center" }}>
                {isAuthenticated || code ? (width! > 800 ? (<Illustration />) : null) : (
                  <CardContent className="text-center">
                    <Alert className="mb-4">
                      <AlertTitle> <InfoIcon className="h-7 w-7 mr-2" style={{ display: 'inline' }} />Discord Connection Required</AlertTitle>
                      <AlertDescription className="mt-2">
                        Please connect your Discord to proceed. Blinkord requires you to connect your Discord in order to assign you the purchased role
                      </AlertDescription>
                    </Alert>
                    <Button
                      onClick={onConnect}
                      className="w-fit h-10 sm:h-12 bg-builderz-blue hover:bg-neon-cyan text-black font-bold py-2 px-4 sm:px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                      <img className="mr-2 h-4 w-4 sm:h-5 sm:w-5" src="https://unpkg.com/simple-icons@v13/icons/discord.svg" />
                      Connect Discord
                    </Button>
                  </CardContent>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: width! < 800 ? 0 : 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 w-full"
          >
            <Card className="w-full h-auto">
              <CardContent>
                <BlinkDisplay serverId={serverId} code={code} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

const WelcomeText = () => (
  <CardHeader>
    <CardTitle className="text-2xl font-bold text-center">
      Welcome to <span className="highlight-cyan">Blinkord</span>
    </CardTitle>
    <CardDescription className="text-center">
      You're one step away from unlocking exclusive content and features on your
      favorite <span className="highlight-cyan">Discord</span> servers!
    </CardDescription>
  </CardHeader>
);

const Illustration = () => (
  <motion.h1
    className="text-3xl font-normal tracking-tight md:text-6xl"
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <motion.span className="relative inline-block group" whileHover={{ scale: 1.05 }}>
      <Image
        src="/helmet.svg"
        alt="Illustration"
        width={400}
        height={400}
        style={{ margin: "auto" }}
        className="rounded-lg full"
      />
      <motion.div
        className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-neon-blue z-10"
        animate={{ rotate: 0 }}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 2, ease: "linear" }}
      />
      <motion.div
        className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-neon-pink z-10"
        animate={{ rotate: 0 }}
        whileHover={{ rotate: -360 }}
        transition={{ duration: 2, ease: "linear" }}
      />
      <motion.div
        className="absolute top-0 left-0 right-0 w-full h-32 bg-neon-purple opacity-20 z-0"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 2, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 w-full h-32 bg-cyan-400 opacity-20 z-0"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 2, ease: "linear" }}
      />
    </motion.span>
  </motion.h1>
);

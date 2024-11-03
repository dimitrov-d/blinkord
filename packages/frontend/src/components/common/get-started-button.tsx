"use client";

import { useState, useEffect } from "react";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useLogin, usePrivy, getAccessToken } from "@privy-io/react-auth";
import { cn } from "@/lib/utils";

export const handleConnectDiscord = async () => {

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/login?owner=true`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    }
  } catch (error) {
    console.error("Failed to connect Discord", error);
  }
};

export default function GetStartedButton({
  className,
}: {
  className?: string;
}) {

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login }  = useLogin({
    onComplete: (user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount) => {
      console.log(user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount);
      // Any logic you'd like to execute if the user is/becomes authenticated while this
      // component is mounted
    },
    onError: (error) => {
      console.log(error);
      // Any logic you'd like to execute after a user exits the login flow or there is an error
    },
  });
 
  const {
    ready,
    authenticated,
    logout,
  } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
    if (ready && authenticated) {
      router.push("/wallet");
    }
    
  }, [ready, authenticated, router]);

  const handleGetStartedClick = async () => {
    setLoading(true);
    await handleConnectDiscord();
    setLoading(false);
  };
  // {() => login({loginMethods: ['email', 'sms']})}

  return (
    <Button
      onClick={ready && authenticated ? logout : login}
      className={cn(
        "w-fit bg-builderz-blue hover:bg-neon-cyan text-black font-bold px-6 py-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50",
        {
          "opacity-30": loading,
        },
        className
      )}
      disabled={loading}
    >
      {
        ready && authenticated ? 
        <div className="flex">
          Log Out
          <LogOut className="ml-2 h-4 w-4 sm:h-5 sm:w-5" /> 
        </div>
        :
        <>
          <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> 
          Get Started
        </>
      }
    </Button>
  );
}

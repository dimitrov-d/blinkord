"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function GetStartedButton({
  className,
}: {
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleConnectDiscord = async () => {
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleConnectDiscord}
      className={cn(
        "bg-builderz-blue hover:bg-neon-cyan text-black font-bold px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50",
        {
          "opacity-30": loading,
        },
        className
      )}
      disabled={loading}
    >
      <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Get Started
    </Button>
  );
}

"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function AddBlinkordBotButton({
  className,
}: {
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleAuthorizeDiscord = () => {
    setLoading(true);
    window.open(
      "https://discord.com/oauth2/authorize?client_id=1277276051592052787&permissions=268443649&integration_type=0&scope=bot+applications.commands",
      "popup",
      "width=600,height=600"
    );
    setLoading(false);
  };

  return (
    <Button
      onClick={handleAuthorizeDiscord}
      className={cn(
        "bg-[#008FE7] text-white font-bold px-6 py-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 mt-10",
        {
          "opacity-30": loading,
        },
        className
      )}
      disabled={loading}
    >
      <PlusCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Add to your server
    </Button>
  );
}
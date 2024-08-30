"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BlinkPreview } from "@/components/blink/blink-display";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { CopyIcon, CheckIcon } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { BlinkDisplay } from "@/components/blink/blink-display";

export default function SuccessPage() {
  const [blinkUrl, setBlinkUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const serverId = searchParams.get("serverId");
    const code = searchParams.get("code");
    if (serverId && code) {
      setBlinkUrl(`${window.location.origin}/blink/${serverId}?code=${code}`);
    }

    const shootConfetti = () => {
      const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["star"],
        colors: ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"],
      };

      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ["star"],
      });

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ["circle"],
      });
    };

    shootConfetti();
    const timer = setInterval(shootConfetti, 3000);

    return () => clearInterval(timer);
  }, [searchParams]);

  const handleShare = (platform: string) => {
    if (platform === "discord") {
      // Implement Discord sharing logic here
      console.log("Sharing on Discord");
    } else if (platform === "whatsapp") {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(blinkUrl)}`,
        "_blank"
      );
    } else if (platform === "telegram") {
      window.open(
        `https://t.me/share/url?url=${encodeURIComponent(blinkUrl)}`,
        "_blank"
      );
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(blinkUrl);
    setCopied(true);
    toast({
      title: "Copied to clipboard!",
      description: "The Blink URL has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-center mb-8 text-navy-900"
        >
          Blink Created Successfully! 🎉
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-navy-900">
              Your Blink
            </h2>
            <div className="mb-6 bg-gray-100 p-4 rounded-lg">
              <BlinkPreview
                serverId={searchParams.get("serverId") || ""}
                code={searchParams.get("code") || ""}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Button
                onClick={handleCopy}
                className="w-full sm:w-auto flex items-center justify-center bg-white text-navy-900 border border-navy-900"
                variant="outline"
              >
                {copied ? (
                  <CheckIcon className="mr-2 h-4 w-4" />
                ) : (
                  <CopyIcon className="mr-2 h-4 w-4" />
                )}
                {copied ? "Copied!" : "Copy Link"}
              </Button>

              <Button
                onClick={() => handleShare("discord")}
                className="w-full sm:w-auto bg-[#5865F2] hover:bg-[#4752C4] text-white"
              >
                <Image
                  src="/images/discord.svg"
                  alt="Discord"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                Share on Discord
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-navy-900">
              Share Your Blink
            </h2>
            <p className="mb-6 text-gray-600">
              Share your Blink with friends and family on other platforms:
            </p>
            <div className="flex flex-col space-y-4">
              <Button
                onClick={() => handleShare("whatsapp")}
                className="bg-[#25D366] hover:bg-[#128C7E] text-white"
              >
                <Image
                  src="/images/whatsapp.png"
                  alt="WhatsApp"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                Share on WhatsApp
              </Button>
              <Button
                onClick={() => handleShare("telegram")}
                className="bg-[#0088cc] hover:bg-[#0077b5] text-white"
              >
                <Image
                  src="/images/telegram.png"
                  alt="Telegram"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                Share on Telegram
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white rounded-lg shadow-lg p-6 w-full"
        >
          <h2 className="text-2xl font-semibold mb-4 text-navy-900">
            Your Blink Preview
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <BlinkDisplay
              serverId={searchParams.get("serverId") || ""}
              code={searchParams.get("code") || ""}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

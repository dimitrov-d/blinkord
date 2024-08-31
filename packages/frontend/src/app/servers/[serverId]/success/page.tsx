"use client";

import { useState, useEffect } from "react";
import { BlinkPreview } from "@/components/blink/blink-display";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { MotionInput, MotionButton } from "@/components/motion";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const [blinkUrl, setBlinkUrl] = useState("");
  const [serverId, setServerId] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const { toast } = useToast();
  const [imageSrc, setImageSrc] = useState("/images/og-image.png");
  const router = useRouter();

  useEffect(() => {
    const id = window.location.pathname.split("/")?.at(-2);
    if (id) setServerId(id);
  }, []);

  useEffect(() => {
    if (!serverId) {
      return;
    }

    setBlinkUrl(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/${serverId}`);
    setCustomUrl(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/${serverId}`);

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
  }, [serverId]);

  const handleShare = (platform: string) => {
    if (platform === "discord") {
      window.open(`https://discord.com/channels/${serverId}`, "_blank");
    } else if (platform === "x") {
      window.open(
        `https://twitter.com/intent/tweet?text=Check%20out%20my%20Blink!%20${encodeURIComponent(blinkUrl)}`,
        "_blank"
      );
    }
  };

  const copyCustomUrl = () => {
    navigator.clipboard.writeText(customUrl);
    toast({
      title: "Custom URL Copied!",
      description: "The custom URL has been copied to your clipboard.",
    });
  };

  // Validate and set image source
  useEffect(() => {
    const imageUrl = "/images/x.webp"; // Example URL
    try {
      new URL(imageUrl); // Check if valid URL
      setImageSrc(imageUrl); // If valid, use the provided URL
    } catch (error) {
      console.error("Invalid URL, using placeholder image instead.");
      setImageSrc("/images/placeholder.png"); // Fallback to placeholder
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-center mb-8 text-navy-900"
        >
          Blink Created Successfully! 🎉
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg p-4 md:p-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-navy-900">
              Your Blink
            </h2>
            <div className=" bg-gray-100 rounded-lg">
              <BlinkPreview serverId={serverId} code={""} />
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-4 md:p-6 flex flex-col justify-between"
          >
            <h2 className="text-2xl font-semibold mb-4 text-navy-900">
              Your custom Blink URL
            </h2>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <MotionInput
                type="text"
                value={customUrl}
                readOnly
                className="flex-grow mr-4"
                whileFocus={{ scale: 1.05 }}
              />
              <MotionButton
                onClick={copyCustomUrl}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CopyIcon className="mr-2 h-4 w-4" />
                Copy URL
              </MotionButton>
            </div>
            <Separator className="my-4" />

            <h2 className="text-2xl font-semibold mb-4 text-navy-900">
              Share Your Blink
            </h2>
            <p className="mb-6 text-gray-600">
              Share the URL with other people so they can gain access to your
              Discord's premium roles
            </p>
            <div className="flex flex-col space-y-4">
              <Button
                onClick={() => handleShare("x")}
                className="bg-[#000000] hover:bg-[#231F1F] text-white"
              >
                <Image
                  src={imageSrc} // Use the validated or placeholder image
                  alt="X"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                Spread the word
              </Button>
              <Button
                onClick={() => handleShare("discord")}
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
              >
                <Image
                  src={imageSrc} // Use the validated or placeholder image
                  alt="Discord"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                Share on Discord
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="mt-8" style={{ textAlign: "center" }}>
              <motion.h1
                className="text-3xl font-normal tracking-tight md:text-6xl"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.span
                  className="relative inline-block group"
                  whileHover={{ scale: 1.05 }}
                >
                  <Image
                    src="/jumping.png"
                    alt="Illustration"
                    width={150}
                    height={150}
                    className="rounded-lg"
                    style={{ maxWidth: "100%", height: "auto" }}
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
                    className="absolute -inset-4 bg-neon-purple/30 opacity-20 z-0"
                    animate={{ rotate: [0, 360] }}
                  />
                </motion.span>{" "}
              </motion.h1>{" "}
            </div>
            <div className="mt-8 flex justify-center w-full">
              <Button
                variant="default"
                className="w-full"
                onClick={() => router.push(`/servers/${serverId}/manage`)}
              >
                Manage your Blink 👀
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import Image from "next/image";
import DiscordLogo3D from "../discord-3rf";

export function ConnectDiscordScreen({ onConnect }: { onConnect: () => void }) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-excon">
      {/* Gradient bubbles */}
      <motion.div
        className="absolute top-20 left-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl px-4 pt-4 md:px-6 md:pt-32">
        <motion.h1
          className="text-3xl font-normal tracking-tight md:text-6xl"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Unlock premium
          <motion.span
            className="relative inline-block group"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              className="my-auto -mt-3 inline w-24 md:-mt-6 md:w-48 z-20 relative"
              width={192}
              height={108}
              src="/evolve.svg"
              alt=""
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
              className="absolute -inset-4 bg-neon-purple opacity-20 z-0"
              animate={{ rotate: [0, 360] }}
            />
          </motion.span>{" "}
          Discord
          <motion.span
            className="relative inline-block group mx-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="absolute inset-0 -z-10 flex justify-center items-center">
              <motion.div
                className="absolute top-1/4 -right-1/4 w-0 h-0 border-l-[25px] sm:border-l-[35px] md:border-l-[45px] border-l-transparent border-r-[25px] sm:border-r-[35px] md:border-r-[45px] border-r-transparent border-b-[50px] sm:border-b-[70px] md:border-b-[90px] border-b-gray-700 z-10"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              />
              <motion.div
                className="absolute top-0 left-1/4 w-0 h-0 border-l-[25px] sm:border-l-[35px] md:border-l-[45px] border-l-transparent border-r-[25px] sm:border-r-[35px] md:border-r-[45px] border-r-transparent border-b-[50px] sm:border-b-[70px] md:border-b-[90px] border-b-yellow-400 z-1"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              />
              <motion.div
                className="absolute top-1/4 left-0 w-32 sm:w-40 md:w-48 h-24 sm:h-28 md:h-32 bg-indigo-600 z-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              />
            </div>
            <Image
              className="inline w-24 sm:w-32 md:w-40 lg:w-48 z-20 relative"
              width={192}
              height={108}
              src="/transhumans-roboto.webp"
              alt=""
            />
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-neon-blue z-10"
              animate={{ rotate: 0 }}
              whileHover={{ rotate: -360 }}
              transition={{ duration: 2, ease: "linear" }}
            />
          </motion.span>
          experiences with Blinkord.
        </motion.h1>{" "}
        <motion.div
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-center mb-6"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="mb-4">
            Monetize your <span className="highlight-green">Discord</span>{" "}
            server <span className="highlight-cyan">effortlessly</span>.
          </p>
        </motion.div>
        <motion.p
          className="opacity-50 dark:text-white text-black text-base sm:text-lg md:text-xl text-center mb-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Create shareable links that grant instant access to exclusive roles
          with just a few clicks.
        </motion.p>
        <motion.div
          className="flex justify-center w-full mb-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {" "}
          <DiscordLogo3D />
          <Button
            onClick={onConnect}
            className="w-fit h-12 bg-builderz-blue hover:bg-neon-cyan text-black font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            <LogIn className="mr-2 h-5 w-5" /> Connect Discord
          </Button>
        </motion.div>
        <motion.div
          className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 rounded-lg border border-gray-700 p-4 mb-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 1 }}
        >
          <p className="dark:text-white text-black text-sm sm:text-base">
            Hackathon Sponsors:
          </p>
          <Image
            className="h-4 sm:h-6 w-auto"
            src="/solana.svg"
            alt="Solana"
            width={100}
            height={24}
          />
          <Image
            className="h-4 sm:h-6 w-auto"
            src="/alldomains.svg"
            alt="AllDomains"
            width={100}
            height={24}
          />
          <Image
            className="h-4 sm:h-6 w-auto"
            src="/helius.svg"
            alt="Helius"
            width={100}
            height={24}
          />
          <Image
            className="h-4 sm:h-6 w-auto"
            src="/dialect.svg"
            alt="Dialect"
            width={100}
            height={24}
          />
          <Image
            className="h-4 sm:h-6 w-auto"
            src="/bags.svg"
            alt="Bags"
            width={100}
            height={24}
          />
        </motion.div>
      </div>
    </div>
  );
}

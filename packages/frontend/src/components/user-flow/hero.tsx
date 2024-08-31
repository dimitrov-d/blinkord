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
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden font-excon px-4 py-8 md:px-6 md:py-12">
      {/* Gradient bubbles */}
      <motion.div
        className="absolute top-10 left-10 w-24 h-24 md:w-40 md:h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
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
        className="absolute bottom-10 right-10 w-36 h-36 md:w-60 md:h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
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
      <div className="relative z-10 w-full sm:max-w-3xl xl:max-w-5xl h-full flex flex-col items-center justify-center">
        <motion.h1
          className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-normal tracking-tight text-center my-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Unlock premium
          <motion.span
            className="relative inline-block group mx-1"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              className="my-auto -mt-1 md:-mt-2 inline w-16 sm:w-20 md:w-24 lg:w-32 xl:w-48 z-20 relative"
              width={192}
              height={108}
              src="/evolve.svg"
              alt=""
            />
            <motion.div
              className="absolute -top-1 -left-1 md:-top-2 md:-left-2 w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 border-t-2 border-l-2 border-neon-blue z-10"
              animate={{ rotate: 0 }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 2, ease: "linear" }}
            />
            <motion.div
              className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 border-b-2 border-r-2 border-neon-pink z-10"
              animate={{ rotate: 0 }}
              whileHover={{ rotate: -360 }}
              transition={{ duration: 2, ease: "linear" }}
            />
            <motion.div
              className="absolute -inset-2 md:-inset-3 lg:-inset-4 bg-neon-purple opacity-20 z-0"
              animate={{ rotate: [0, 360] }}
            />
          </motion.span>{" "}
          Discord
          <motion.span
            className="relative inline-block group mx-1 md:mx-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="absolute inset-0 -z-10 flex justify-center items-center">
              <motion.div
                className="absolute top-1/4 -right-1/4 w-0 h-0 border-l-[15px] sm:border-l-[20px] md:border-l-[25px] lg:border-l-[35px] xl:border-l-[45px] border-l-transparent border-r-[15px] sm:border-r-[20px] md:border-r-[25px] lg:border-r-[35px] xl:border-r-[45px] border-r-transparent border-b-[30px] sm:border-b-[40px] md:border-b-[50px] lg:border-b-[70px] xl:border-b-[90px] border-b-gray-700 z-10"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              />
              <motion.div
                className="absolute top-0 left-1/4 w-0 h-0 border-l-[15px] sm:border-l-[20px] md:border-l-[25px] lg:border-l-[35px] xl:border-l-[45px] border-l-transparent border-r-[15px] sm:border-r-[20px] md:border-r-[25px] lg:border-r-[35px] xl:border-r-[45px] border-r-transparent border-b-[30px] sm:border-b-[40px] md:border-b-[50px] lg:border-b-[70px] xl:border-b-[90px] border-b-yellow-400 z-1"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              />
              <motion.div
                className="absolute top-1/4 left-0 w-20 sm:w-24 md:w-32 lg:w-40 xl:w-48 h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 bg-indigo-600 z-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              />
            </div>
            <Image
              className="inline w-16 sm:w-20 md:w-24 lg:w-32 xl:w-48 z-20 relative"
              width={192}
              height={108}
              src="/transhumans-roboto.webp"
              alt=""
            />
            <motion.div
              className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 border-t-2 border-r-2 border-neon-blue z-10"
              animate={{ rotate: 0 }}
              whileHover={{ rotate: -360 }}
              transition={{ duration: 2, ease: "linear" }}
            />
          </motion.span>
          <span className="z-100 ml-4 md:ml-6 xl:ml-10">experiences</span> with <span className="highlight-blue">Blinkord</span>.
        </motion.h1>
        
        <motion.div
          className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-center mb-4 md:mb-6"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="mb-2 ">
            Monetize your <span className="highlight-green">Discord</span>{" "}
            server <span className="highlight-cyan">effortlessly</span>.
          </p>
        </motion.div>
        
        <motion.p
          className="opacity-50 dark:text-white text-black text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-center mb-4 "
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Create shareable links that grant access to exclusive discord roles
          with just a few clicks.
        </motion.p>
        <div className="flex justify-center w-full sm:w-auto mb-4 sm:mb-0 xl:my-2">
            <Button
              onClick={onConnect}
              className="w-full sm:w-auto md:w-64 h-10  sm:h-12 bg-builderz-blue hover:bg-neon-cyan text-black font-bold py-2 px-4 sm:px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Connect Discord
            </Button>
          </div>
      </div>
    
    
      <motion.div
        className="w-full max-w-7xl h-full sm:my-2"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 1 }}
      >
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 rounded-lg border border-gray-700 p-3 md:p-4">
          <p className="dark:text-white text-black text-xs sm:text-sm md:text-base w-full text-center mb-2">
            Hackathon Sponsors:
          </p>
          <Image
            className="h-3 sm:h-4 md:h-5 lg:h-6 w-auto"
            src="/solana.svg"
            alt="Solana"
            width={100}
            height={24}
          />
          <Image
            className="h-3 sm:h-4 md:h-5 lg:h-6 w-auto"
            src="/alldomains.svg"
            alt="AllDomains"
            width={100}
            height={24}
          />
          <Image
            className="h-3 sm:h-4 md:h-5 lg:h-6 w-auto"
            src="/helius.svg"
            alt="Helius"
            width={100}
            height={24}
          />
          <Image
            className="h-3 sm:h-4 md:h-5 lg:h-6 w-auto"
            src="/dialect.svg"
            alt="Dialect"
            width={100}
            height={24}
          />
          <Image
            className="h-3 sm:h-4 md:h-5 lg:h-6 w-auto"
            src="/bags.svg"
            alt="Bags"
            width={100}
            height={24}
          />
        </div>
      </motion.div>
    </div>
  );
}
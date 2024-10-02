"use client";

import { motion } from "framer-motion";
import { CircleCheck, PlusCircle } from "lucide-react";
import GridPatternBg from "../common/grid-pattern-bg";
import GetStartedButton from "../common/get-started-button";
import { cn } from "@/lib/utils";
import Button from "@mui/material/Button";
import AddBlinkordBotButton from "../common/discord-bot-button";

function MeetTheBot() {
  const gridBlocks = [
    [2, 5],
    [3, 1],
    [4, 3],
  ];

  return (
    <section className="bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:bg-slate-950 dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <div className="relative bg-gradient-to-r from-green-300/20 via-cyan-200/20 to-indigo-600/20 dark:bg-gradient-to-r dark:from-stone-800/5 dark:via-stone-800/5 p-4 w-full min-h-[384px] sm:h-full flex flex-col flex-1 transition-colors duration-300 ease-in-out delay-50 items-center justify-center">
        <GridPatternBg
          className="[mask-image:linear-gradient(-85deg,black,transparent)]"
          gridBlocks={gridBlocks}
        />
        <div className="container py-20 md:py-24 lg:py-36 mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col justify-center md:flex-row md:items-center gap-10">
            <div className="md:w-1/2 rounded-xl py-10 flex flex-col items-center">
              <motion.img
                className="dark:hidden object-contain w-60 h-60"
                src="/images/logo-black.svg"
                alt="Blinkord"
                animate={{
                  translateY: [-7, 7],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 1,
                  ease: "easeInOut",
                }}
              />
              <motion.img
                className="hidden dark:block object-contain w-60 h-60"
                src="/images/logo-white.svg"
                alt="Blinkord"
                animate={{
                  translateY: [-7, 7],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 1,
                  ease: "easeInOut",
                }}
              />
              <AddBlinkordBotButton />
            </div>
            <div>
              <h1 className="text-4xl mb-10">Meet The Blinkord Bot</h1>
              <ul className="flex flex-col gap-5">
                <li className="flex items-center gap-2">
                  <div>
                    <CircleCheck className="w-8" />
                  </div>
                  Displays Blink actions in Discord, allowing users to interact
                  and send transactions directly within the app
                </li>
                <li className="flex items-center gap-2">
                  <div>
                    <CircleCheck className="w-8" />
                  </div>
                  Detects Blink URLs and instantly provides available actions,
                  simplifying user interactions
                </li>
                <li className="flex items-center gap-2">
                  <div>
                    <CircleCheck className="w-8" />
                  </div>
                  Enables users to create and manage a secure Solana wallet
                  without leaving the Discord app
                </li>
                <li className="flex items-center gap-2">
                  <div>
                    <CircleCheck className="w-8" />
                  </div>
                  Ensures wallet security by using a dedicated Key Management
                  Service (KMS) and using MPC wallet solutions (🔜)
                </li>
                <li className="flex items-center gap-2">
                  <div>
                    <CircleCheck className="w-8" />
                  </div>
                  Automatically assigns premium roles to members after
                  successful payments, giving instant access
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MeetTheBot;

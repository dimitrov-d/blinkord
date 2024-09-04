"use client";

import React, { useEffect, useState, Suspense } from "react";
import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUserStore } from "@/lib/contexts/zustand/userStore";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import { ThemeContext } from "@/lib/contexts/ThemeProvider";

function RedirectComponent() {
  const router = useRouter();
  const controls = useAnimation();
  const [callbackHandled, setCallbackHandled] = useState(false);
  const { isDark } = useContext(ThemeContext);

  const setToken = useUserStore((state) => state.setToken);
  const setUserData = useUserStore((state) => state.setUserData);
  const setDiscordConnected = useUserStore(
    (state) => state.setDiscordConnected
  );
  const setDiscordDisconnected = useUserStore(
    (state) => state.setDiscordDisconnected
  );

  const searchParams = useSearchParams();

  const handleCodeCallback = async (
    code: string,
    searchParams: URLSearchParams
  ) => {
    if (callbackHandled) return;

    // serverId in state indicates that it's a user login
    const serverId = searchParams.get("state");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/login/callback?code=${encodeURIComponent(code)}${serverId ? '' : '&owner=true'}`,
        { headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Discord API error:", errorData);
        throw new Error(
          `Discord API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setDiscordConnected(true);

      if (data.token) {
        // Login data was received
        setToken(data.token);
        localStorage.setItem("discordToken", data.token);
        localStorage.setItem("guilds", JSON.stringify(data.guilds));
        setUserData(data);
      }
      router.push(serverId ? `${serverId}?code=${code}` : '/servers');
    } catch (error) {
      console.error("Error in handleCodeCallback:", error);
      setDiscordDisconnected(true);
    } finally {
      setCallbackHandled(true);
    }
  };

  useEffect(() => {
    const code = searchParams.get("code");
    if (code && !callbackHandled) {
      handleCodeCallback(code, searchParams);
    }
  }, [searchParams, callbackHandled]);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/servers");
    }, 300000);

    controls.start("visible");

    return () => clearTimeout(timer);
  }, [router, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  };

  const shapeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  };

  return (
    <div
      className={`relative flex h-screen flex-col ${isDark ? "bg-gray-900" : "bg-bg"
        }`}
    >
      <div
        className={`grid h-screen place-content-center px-4 ${isDark ? "bg-gray-900" : "bg-white"
          }`}
      >
        <motion.div
          className="absolute inset-0 -z-10 flex justify-center items-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div
            className="absolute top-32 -right-0 w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[100px] border-b-gray-700 -z-50"
            variants={shapeVariants}
          />
          <motion.div
            className="absolute top-0 left-10 w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[100px] border-b-yellow-400 z-1"
            variants={shapeVariants}
          />
          <motion.div
            className="absolute top-10 left-20 w-64 h-36 bg-indigo-600 z-1"
            variants={shapeVariants}
          />
        </motion.div>

        <motion.div
          className="text-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div
            className="mt-6 flex flex-col items-center justify-center"
            variants={itemVariants}
          >
            <motion.div
              className="mt-6 flex items-center justify-center space-x-4"
              variants={itemVariants}
            >
              <Image
                src="/coffee.png"
                alt="First Image"
                className="h-auto w-auto"
                priority
                width={200}
                height={200}
              />
              <Image
                src="/pacheco.png"
                alt="Second Image"
                className="h-auto w-auto"
                priority
                width={200}
                height={200}
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-red-400 rounded-full -z-50"
            variants={shapeVariants}
          />
          <motion.div
            className="absolute bottom-32 right-32 w-10 h-10 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-t-[100px] border-t-blue-600 -z-20"
            variants={shapeVariants}
          />
          <motion.div
            className="absolute top-10 right-10 w-36 h-36 bg-yellow-400 -z-10"
            variants={shapeVariants}
          />
          <motion.div
            className="absolute top-10 -right-0 w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[100px] border-b-gray-700 -z-1 "
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <svg
              aria-hidden="true"
              className="animate-spin h-20 w-20 fill-neutral-600 text-neutral-200 dark:fill-neutral-400 dark:text-neutral-800"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>

          <motion.h1
            className={`mt-6 text-2xl font-bold tracking-tight sm:text-4xl space-y-4 ${isDark ? "text-white" : "text-gray-900"
              }`}
            variants={itemVariants}
          >
            We are{" "}
            <span className="highlight-cyan">
              <span className={`${isDark} ? 'text-white' : ''`}>redirecting</span>
            </span>{" "}
            you,
            <br className="my-4" /> don't forget to{" "}
            <span className="highlight-blue">
              {" "}
              <span className="text-white">blink</span>
            </span>
            ...{" "}
            <motion.span
              className="pr-2 inline-block"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              👀
            </motion.span>
          </motion.h1>
        </motion.div>
      </div>
    </div >
  );
}

export default function Redirect() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RedirectComponent />
    </Suspense>
  );
}

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex h-screen flex-col bg-bg">
      <div className="grid h-screen place-content-center bg-white px-4">
        <div className="absolute inset-0 -z-10 flex justify-center items-center"></div>
        <div className="text-center relative z-10">
          <div className="absolute inset-0 -z-10 flex justify-center items-center">
            <motion.div
              className="absolute top-32 -right-0 w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[100px] border-b-gray-700 z-10 "
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            <motion.div
              className="absolute top-0 left-10 w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[100px] border-b-yellow-400 z-1 "
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            />
            <motion.div
              className="absolute top-10 left-20 w-64 h-36 bg-indigo-600 z-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/transhumans-roboto.webp"
              alt="Not Found"
              className="mx-auto h-56 w-auto text-black sm:h-64 z-10"
              priority
              width={800}
              height={400}
            />
          </motion.div>
          <motion.h1
            className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Uh-oh!
          </motion.h1>
          <motion.h1
            className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            We can't find that page.
          </motion.h1>
          <motion.h2
            className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Don't forget to blink.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6 flex items-center justify-center group"
          >
            <motion.span
              className="ml-2 text-2xl"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 1,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 1,
              }}
            >
              <span className="opacity-0 group-hover:opacity-100 pr-2 inline-block transition-all duration-300 ease-in-out transform rotate-180 mr-2">
                🫤👀
              </span>{" "}
            </motion.span>
            <Link
              href="/"
              className="inline-flex items-center rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Blink back home
            </Link>
            <motion.span
              className="ml-2 text-2xl"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 1,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 1,
              }}
            >
              <span className="opacity-0 group-hover:opacity-100">👀💫</span>
            </motion.span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

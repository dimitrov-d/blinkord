"use client";

import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { ThemeContext } from "@/lib/contexts/ThemeProvider";

export default function Footer() {
  const { isDark } = useContext(ThemeContext);

  return (

    <footer className="w-full py-4 bg-gradient-to-r from-green-400 to-blue-500 dark:from-green-600 dark:to-blue-700">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image
            src="/star-purple.svg"
            alt="Purple Star"
            width={20}
            height={20}
          />
          <span className={`${isDark ? "text-gray-300" : "text-gray-700"} text-[12px]`}>
            © 2024 Blinkord. All rights reserved.
          </span>
        </div>
        <div className="flex items-center space-x-6 mt-4 md:mt-0">
          <a
            href="mailto:hi@blinkord.com?subject=Blinkord Feedback"
            className="text-[15px] font-bold navLink text-white"
            rel="noopener noreferrer"
          >
            Feedback
          </a>
          <Link
            href="https://discord.gg/HugHTEPu4H"
            className="text-[15px] font-bold navLink text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord
          </Link>
          <Link
            href="https://docs.blinkord.com"
            className="text-[15px] font-bold navLink text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
          </Link>
          <Link
            href="/marketplace"
            className="text-[15px] font-bold navLink text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Marketplace
          </Link>
        </div>
      </div>
    </footer>
  );
}

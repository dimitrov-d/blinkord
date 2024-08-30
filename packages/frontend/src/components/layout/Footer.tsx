"use client";

import Image from "next/image";
import { useContext } from "react";
import { ThemeContext } from "@/lib/contexts/ThemeProvider";

export default function Footer() {
  const { isDark } = useContext(ThemeContext);

  return (
    <footer className="w-full py-4 bg-gradient-to-r from-green-400 to-blue-500 dark:from-green-600 dark:to-blue-700">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image src="/smiley.svg" alt="Smiley Face" width={24} height={24} />
          <span className="text-white font-semibold">Blinkord</span>
        </div>
        <div className="flex items-center space-x-4">
          <Image
            src="/star-purple.svg"
            alt="Purple Star"
            width={20}
            height={20}
          />
          <span className="text-white text-sm">
            © 2024 Blinkord. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

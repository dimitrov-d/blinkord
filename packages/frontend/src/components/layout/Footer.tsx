"use client";

import Link from "next/link";
import { Book, Mail, Store } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full py-10 bg-blink-green">
      <div className="max-w-7xl mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between">
        <div className="flex items-center space-x-2 mt-8 md:mt-0">
          <span className="text-gray-700 text-sm">
            © {new Date().getFullYear()} Blinkord. All rights reserved.
          </span>
        </div>
        <div className="flex items-center space-x-6 mt-4 md:mt-0">
          {/* Feedback */}
          <Link
            href="mailto:hi@blinkord.com?subject=Blinkord Feedback"
            className="text-[15px] font-bold navLink text-black"
            rel="noopener noreferrer"
          >
            <Mail className="h-6 w-6" />
          </Link>

          {/* Discord */}
          <Link
            href="https://discord.gg/HugHTEPu4H"
            className="text-[15px] font-bold navLink text-black"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/discord-outline.svg"
              alt="Discord"
              width={35}
              height={35}
              className="mr-2"
            />
          </Link>

          {/* X */}
          <Link
            href="https://x.com/blinkord_sol"
            className="text-[15px] font-bold navLink text-black"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/x-outline.svg"
              alt="X"
              width={20}
              height={20}
              className="mr-2"
            />
          </Link>

          {/* Marketplace */}
          <Link
            href="/marketplace"
            className="text-[15px] font-bold navLink text-black"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Store className="h-6 w-6" />
          </Link>

          {/* Docs */}
          <Link
            href="https://docs.blinkord.com"
            className="text-[15px] font-bold navLink text-black"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Book className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

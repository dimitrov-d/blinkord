"use client";

import Image from "next/image";
import { useContext } from "react";
import { ThemeContext } from "@/lib/contexts/ThemeProvider";

export default function Footer() {
  const { isDark, setIsDark } = useContext(ThemeContext);
  return (
    <>
      <footer className="w-full flex flex-row items-center justify-center gap-8 absolute z-50 bottom-0 left-1/2 -translate-x-1/2 bg-transparent text-black shadow-xl  border-t border-t-0.5 border-t-gray-300 ">
        <div className="max-w-7xl mx-auto flex items-center">
          {/* Left side */}
          <div className="flex-1 relative">
            <Image
              src="/Union.svg"
              alt="Union"
              width={50}
              height={50}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
            />
            <div className="w-full h-[1px] bg-purple-600 " />
          </div>

          {/* Center */}
          <div className="z-20">
            <Image
              src="/smiley.svg"
              alt="Smiley Face"
              width={100}
              height={100}
            />
          </div>

          {/* Right side */}
          <div className="flex items-center flex-1 justify-end relative">
            <div className="w-full h-[1px] bg-purple-600" />
            <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 flex items-center z-10">
              <Image
                src="/star-purple.svg"
                alt="Purple Star"
                width={100}
                height={100}
                className="rounded-full object-cover "
              />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

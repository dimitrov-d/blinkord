"use client";

import Box from "@mui/material/Box";
import { Logo } from "@/components/logo";
import React, { useContext, useEffect, useState } from "react";
import ThemeSwitcherComponent from "./ThemeSwitcher";
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";
import { ThemeContext } from "@/lib/contexts/ThemeProvider";
import GetStartedButton from "../common/get-started-button";
import MyMultiButton from "./MyMultiButton";
import { usePathname } from 'next/navigation'
import { Book, Store } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const { isDark, setIsDark } = useContext(ThemeContext);
  const [showLogo, setShowLogo] = useState(true);
  const pathname = usePathname()

  useEffect(() => {
    const savedTheme = localStorage.getItem("isDark");
    if (savedTheme) {
      setIsDark(JSON.parse(savedTheme));
      document.documentElement.classList.toggle("dark", JSON.parse(savedTheme));
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowLogo(false);
      } else {
        setShowLogo(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header>
      <Box
        sx={{ flexGrow: 1 }}
        className={`w-full z-40 max-w-7xl mx-auto fixed top-4 left-1/2 -translate-x-1/2 rounded-lg transition-all duration-300 ${showLogo ? "bg-transparent dark:bg-gray-900 shadow-lg border border-0.5 border-gray-100 dark:border-gray-800" : "bg-transparent dark:bg-transparent backdrop-blur-md shadow-none border-none"}`}
      >
        <div className="w-full ">
          <Toolbar>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between", // Adjusted to space-between
                width: "100%", // Ensure full width
              }}
            >
              <Logo isDark={isDark} />
              {showLogo && (
                <div className="hidden lg:flex items-center justify-center px-10 gap-6 "> {/* Adjusted to justify-center */}
                  <Link
                    href="https://discord.gg/HugHTEPu4H"
                    className="text-[#000000] dark:text-white text-[16px] font-bold navLink flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={isDark ? "/images/discord-outline-white.svg" : "/images/discord-outline.svg"}
                      alt="Discord"
                      width={25}
                      height={25}
                      className="mr-2"
                    />
                    Discord
                  </Link>
                  <Link
                    href="https://docs.blinkord.com"
                    className="text-[#000000] dark:text-white text-[16px] font-bold navLink flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Book className="h-4 w-4 mr-2" />
                    Docs
                  </Link>
                  <Link
                    href="/marketplace"
                    className="text-[#000000] dark:text-white text-[16px] font-bold navLink flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Store className="h-4 w-4 mr-2" />
                    Marketplace
                  </Link>
                </div>
              )}
              <div className="flex items-center gap-2">
                <ThemeSwitcherComponent isDark={isDark} setIsDark={setIsDark} />
                {pathname === '/' ? (
                  <GetStartedButton className="bg-neon-cyan w-fit" />
                ) : (
                  <MyMultiButton />
                )}
              </div>
            </Box>
          </Toolbar>
        </div>
      </Box>
    </header>
  );
}

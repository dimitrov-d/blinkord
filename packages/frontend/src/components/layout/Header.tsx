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
import { Book, SquareChartGantt, Store, WalletCards } from "lucide-react";
import Image from "next/image";
import Drawer from "../drawer";
import { usePrivy } from "@privy-io/react-auth";

export default function Header() {
  const { isDark, setIsDark } = useContext(ThemeContext);
  const [showLogo, setShowLogo] = useState(true);
  const pathname = usePathname()
  const { ready, authenticated } = usePrivy();

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
        className={`w-full z-40 max-w-7xl mx-auto fixed top-4 left-1/2 -translate-x-1/2 rounded-lg transition-all duration-300 ${showLogo ? 'bg-transparent dark:bg-gray-900 shadow-lg border border-0.5 border-gray-100 dark:border-gray-800' : 'bg-transparent dark:bg-transparent backdrop-blur-md shadow-none border-none'}`}
      >
        <div className="w-full ">
          <Toolbar>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div className="flex items-center">
                <Drawer />
                <Logo isDark={isDark} />
              </div>
              {showLogo && (
                <div className="hidden lg:flex items-center justify-center px-10 gap-8 ">
                  <Link
                    href="https://discord.gg/HugHTEPu4H"
                    className="text-[#555555] dark:text-white text-[16px] font-bold navLink"
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
                    className={`text-[#555555] dark:text-white text-[16px] font-bold navLink`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Book className="h-4 w-4 mr-2" />
                    Docs
                  </Link>
                  <Link
                    href="/marketplace"
                    className={`${pathname==='/marketplace'?'text-[#000000]':'text-[#555555]'} dark:text-white text-[16px] font-bold navLink`}


                    // className={`${pathname==='/marketplace'?'text-[#000000]':'text-[#555555]'} dark:text-white text-[16px] font-bold navLink`}
                    target="_self"
                    rel="noopener noreferrer"
                  >
                    <Store className="h-4 w-4 mr-2" />
                    Marketplace
                  </Link>
                  <Link
                    href="/servers"
                    className={`${pathname==='/servers'?'text-[#000000]':'text-[#555555]'} dark:text-white text-[16px] font-bold navLink`}
                    target="_self"
                    rel="noopener noreferrer"
                  >
                    <SquareChartGantt className="h-4 w-4 mr-2" />
                    My Blinks
                  </Link>
                  {
                    ready && authenticated &&
                    <Link
                      href="/wallet"
                      className={`${pathname==='/wallet'?'text-[#000000]':'text-[#555555]'} dark:text-white text-[16px] font-bold navLink`}
                      target="_self"
                      rel="noopener noreferrer"
                    >
                      <WalletCards className="h-4 w-4 mr-2" />
                      My Wallet
                    </Link>
                  }
                </div>
              )}
              <div className="flex items-center gap-2">
                <ThemeSwitcherComponent isDark={isDark} setIsDark={setIsDark} />
                {pathname === '/' ? (
                  <GetStartedButton />
                ) : (
                  <GetStartedButton />
                  // <MyMultiButton />
                )}
              </div>
            </Box>
          </Toolbar>
        </div>
      </Box>
    </header>
  );
}










// "use client";

// import Box from "@mui/material/Box";
// import { Logo } from "@/components/logo";
// import React, { useContext, useEffect, useState } from "react";
// import ThemeSwitcherComponent from "./ThemeSwitcher";
// import Toolbar from "@mui/material/Toolbar";
// import Link from "next/link";
// import { ThemeContext } from "@/lib/contexts/ThemeProvider";
// import GetStartedButton from "../common/get-started-button";
// import MyMultiButton from "./MyMultiButton";
// import { usePathname } from 'next/navigation'
// import { Book, SquareChartGantt, Store, WalletCards } from "lucide-react";
// import Image from "next/image";
// import Drawer from "../drawer";

// export default function Header() {
//   const { isDark, setIsDark } = useContext(ThemeContext);
//   const [showLogo, setShowLogo] = useState(true);
//   const pathname = usePathname()

//   useEffect(() => {
//     const savedTheme = localStorage.getItem("isDark");
//     if (savedTheme) {
//       setIsDark(JSON.parse(savedTheme));
//       document.documentElement.classList.toggle("dark", JSON.parse(savedTheme));
//     }

//     const handleScroll = () => {
//       if (window.scrollY > 50) {
//         setShowLogo(false);
//       } else {
//         setShowLogo(true);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   return (
//     <header>
//       <Box
//         sx={{ flexGrow: 1 }}
//         className={`w-full z-40 max-w-7xl mx-auto fixed top-4 left-1/2 -translate-x-1/2 rounded-lg transition-all duration-300 ${showLogo ? 'bg-transparent dark:bg-gray-900 shadow-lg border border-0.5 border-gray-100 dark:border-gray-800' : 'bg-transparent dark:bg-transparent backdrop-blur-md shadow-none border-none'}`}
//       >
//         <div className="w-full ">
//           <Toolbar>
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 width: "100%",
//               }}
//             >
//               <div className="flex items-center">
//                 <Drawer />
//                 <Logo isDark={isDark} />
//               </div>
//               {showLogo && (
//                 <div className="hidden lg:flex items-center justify-center px-10 gap-8 ">
//                   <Link
//                     href="https://discord.gg/HugHTEPu4H"
//                     className="text-[#555555] dark:text-white text-[16px] font-bold navLink"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <Image
//                       src={isDark ? "/images/discord-outline-white.svg" : "/images/discord-outline.svg"}
//                       alt="Discord"
//                       width={25}
//                       height={25}
//                       className="mr-2"
//                     />
//                     Discord
//                   </Link>
//                   <Link
//                     href="https://docs.blinkord.com"
//                     className={`text-[#555555] dark:text-white text-[16px] font-bold navLink`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <Book className="h-4 w-4 mr-2" />
//                     Docs
//                   </Link>
//                   <Link
//                     href="/marketplace"
//                     className={`${pathname==='/marketplace'?'text-[#000000]':'text-[#555555]'} dark:text-white text-[16px] font-bold navLink`}
//                     target="_self"
//                     rel="noopener noreferrer"
//                   >
//                     <Store className="h-4 w-4 mr-2" />
//                     Marketplace
//                   </Link>
//                   <Link
//                     href="/servers"
//                     className={`${pathname==='/servers'?'text-[#000000]':'text-[#555555]'} dark:text-white text-[16px] font-bold navLink`}
//                     target="_self"
//                     rel="noopener noreferrer"
//                   >
//                     <SquareChartGantt className="h-4 w-4 mr-2" />
//                     My Blinks
//                   </Link>
//                   <Link
//                     href="/wallet"
//                     className={`${pathname==='/wallet'?'text-[#000000]':'text-[#555555]'} dark:text-white text-[16px] font-bold navLink`}
//                     target="_self"
//                     rel="noopener noreferrer"
//                   >
//                     <WalletCards className="h-4 w-4 mr-2" />
//                     My Wallet
//                   </Link>
//                 </div>
//               )}
//               <div className="flex items-center gap-2">
//                 <ThemeSwitcherComponent isDark={isDark} setIsDark={setIsDark} />
//                 {pathname === '/' ? (
//                   <GetStartedButton />
//                 ) : (
//                   <GetStartedButton />
//                   // <MyMultiButton />
//                 )}
//               </div>
//             </Box>
//           </Toolbar>
//         </div>
//       </Box>
//     </header>
//   );
// }

"use client";

import GridPatternBg from "../common/grid-pattern-bg";
import { Hero } from "../hero/hero";
import DiscordLogo3D from "../discord-3rf";

function HeroSection() {
  const gridBlocks = [
    [2, 5],
    [3, 1],
    [4, 3],
  ];

  return (
    <section className="relative inset-0 h-screen w-full items-center bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:bg-slate-950 dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <div className="relative bg-gradient-to-r from-green-300/20 via-cyan-200/20 to-indigo-600/20 dark:bg-gradient-to-r dark:from-stone-800/5 dark:via-stone-800/5 p-4 w-full min-h-[384px] sm:h-full flex flex-col flex-1 transition-colors duration-300 ease-in-out delay-50 items-center justify-center">
        <GridPatternBg gridBlocks={gridBlocks} />
        <Hero />
        <DiscordLogo3D />
      </div>
    </section>
  );
}

export default HeroSection;

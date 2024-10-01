"use client";

import GetStartedButton from "../common/get-started-button";
import GridPatternBg from "../common/grid-pattern-bg";

export default function CTA() {
  const gridBlocks = [
    [3, 16],
    [4, 4],
    [7, 5],
  ];

  return (
    <section className="">
      <div className="relative bg-gradient-to-r from-green-300/20 via-cyan-200/20 to-indigo-600/20 dark:bg-gradient-to-r dark:from-stone-800/5 dark:via-stone-800/5 p-4 w-full min-h-[384px] sm:h-full flex flex-col flex-1 transition-colors duration-300 ease-in-out delay-50 items-center justify-center">
        <GridPatternBg
          className="[mask-image:linear-gradient(85deg,black,transparent)]"
          gridBlocks={gridBlocks}
        />
        <div className="container pb-20 md:pb-24 lg:pb-36 mx-auto max-w-7xl relative z-10">
          <div className="relative text-center bg-blink-green/70 rounded-xl text-foreground dark:text-background p-10 h-full backdrop-filter backdrop-blur-sm w-full">
            <div className="absolute -top-10 left-0 w-24 h-24 md:w-40 md:h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-40" />
            <div className="absolute -bottom-20 right-20 w-36 h-36 md:w-60 md:h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-40" />

            <h1 className="max-w-3xl mx-auto">
              Unlock Premium Discord Access with Blinkord
            </h1>
            <p className="font-medium opacity-50 mt-3 text-base md:text-xl max-w-3xl mx-auto">
              Effortlessly monetize your Discord server by creating shareable
              links that grant exclusive role access with just a few clicks.
            </p>
            <GetStartedButton className="bg-neon-cyan w-fit mt-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

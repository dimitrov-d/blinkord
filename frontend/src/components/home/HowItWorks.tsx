"use client";

import { CircleCheck } from "lucide-react";
import Image from "next/image";
import GridPatternBg from "../common/grid-pattern-bg";
import GetStartedButton from "../common/get-started-button";

function HowItWorks() {
  const gridBlocks = [
    [1, 15],
    [2, 12],
    [7, 13],
  ];

  return (
    <section className="bg-[#62d1ab]">
      <div className="relative bg-gradient-to-r from-green-300/20 via-cyan-200/20 to-indigo-600/20 dark:bg-gradient-to-r dark:from-stone-800/5 dark:via-stone-800/5 p-4 w-full min-h-[384px] sm:h-full flex flex-col flex-1 transition-colors duration-300 ease-in-out delay-50 items-center justify-center">
        <GridPatternBg
          className="dark:stroke-indigo-600/20"
          gridBlocks={gridBlocks}
        />
        <div className="container py-20 md:py-24 lg:py-36 mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-10 dark:text-black">
            <div>
              <h1 className="text-4xl mb-10">How Blinkord Works</h1>
              <ul className="flex flex-col gap-5">
                <li className="flex items-center gap-2">
                  <div>
                    <CircleCheck className="w-8" />
                  </div>
                  Create a customized blink for your Discord Server, obtain a
                  dedicated payment link
                </li>
                <li className="flex items-center gap-2">
                  <div>
                    <CircleCheck className="w-8" />
                  </div>
                  Share your custom link with your community on any media
                  channel
                </li>
                <li className="flex items-center gap-2">
                  <div>
                    <CircleCheck className="w-8" />
                  </div>
                  Members open the link, authorize with Discord, select their
                  desired subscription, and pay securely using their Solana
                  wallet - all in just a few clicks
                </li>
                <li className="flex items-center gap-2">
                  <div>
                    <CircleCheck className="w-8" />
                  </div>
                  Upon payment, Blinkord automatically assigns the premium role,
                  giving members immediate access to exclusive content
                </li>
                <li className="flex items-center gap-2">
                  <div>
                    <CircleCheck className="w-8" />
                  </div>
                  Blinkord handles subscription payment reminders, so you can
                  focus on engaging your community while we take care of the
                  rest.
                </li>
              </ul>
            </div>
            <div className="relative h-[500px] w-full rounded-xl transform transition-transform duration-300 hover:scale-105">
              <Image
                className="dark:hidden object-contain"
                src="/images/blinkord-community-light.png"
                fill
                alt="Blinkord Community"
              />
              <Image
                className="hidden dark:block object-contain"
                src="/images/blinkord-community-dark.png"
                fill
                alt="Blinkord Community"
              />
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <GetStartedButton />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;

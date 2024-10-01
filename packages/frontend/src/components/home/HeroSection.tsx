"use client";

import OwnerFlow from "@/components/user-flow/owner-flow";
import { GridPattern } from "@/components/ui/grid-pattern";

function HeroSection() {
  const gridBlocks = [
    [2, 5],
    [3, 1],
    [4, 3],
  ];

  return (
    <section className="relative inset-0 h-screen w-full items-center bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:bg-slate-950 dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <div className="overflow-hidden relative bg-gradient-to-r from-green-300/20 via-cyan-200/20 to-indigo-600/20 dark:bg-gradient-to-r dark:from-stone-800/5 dark:via-stone-800/5 p-4 w-full min-h-[384px] sm:h-full flex flex-col flex-1 transition-colors duration-300 ease-in-out delay-50  items-center justify-center ">
        <GridPattern
          size={75}
          offsetX={0}
          offsetY={0}
          className="opacity-10 sm:opacity-100 absolute top-0 left-0 h-full w-full dark:stroke-builderz-blue/10 stroke-indigo-600/20 stroke-[2] [mask-image:linear-gradient(-85deg,black,transparent)]"
        >
          {gridBlocks.map(([row, column], index) => (
            <GridPattern.Block
              key={index}
              row={row}
              column={column}
              className="dark:fill-white/2.5 fill-indigo-600/2.5 transition duration-800 hover:fill-builderz-blue"
            />
          ))}
        </GridPattern>
        <OwnerFlow />
      </div>
    </section>
  );
}

export default HeroSection;

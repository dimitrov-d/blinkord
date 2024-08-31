"use client";

import OwnerFlow from "@/components/user-flow/owner-flow";
import { GridPattern } from "@/components/ui/grid-pattern";

const Index: React.FC = () => {
  const gridBlocks = [
    [2, 5],
    [3, 1],
    [4, 3],
  ];

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="dark:border-stone-800/40 border-stone-300/40 overflow-hidden relative bg-gradient-to-r from-green-300/20 via-cyan-200/20 to-indigo-600/20 dark:bg-gradient-to-r dark:from-stone-800/5 dark:via-stone-800/5 dark:to-stone-800/20 hover:border-b;ue-600/40 dark:hover:border-builderz-blue/50 border p-4 rounded-xl w-full min-h-[384px] sm:h-full flex flex-col flex-1 transition-colors duration-300 ease-in-out delay-50  items-center justify-center ">
        <GridPattern
          size={75}
          offsetX={0}
          offsetY={0}
          className="absolute top-0 left-0 h-full w-full dark:stroke-builderz-blue/10 stroke-indigo-600/20 stroke-[2] [mask-image:linear-gradient(-85deg,black,transparent)]"
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
        <div className="max-w-7xl bg-transparent h-screen">
          <div className="flex flex-col justify-center p-4 bg-inherit gap-10">
            <OwnerFlow />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

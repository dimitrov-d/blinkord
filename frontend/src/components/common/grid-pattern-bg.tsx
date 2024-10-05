import { cn } from "@/lib/utils";
import { GridPattern } from "../ui/grid-pattern";

export default function GridPatternBg({
  className,
  gridBlocks,
}: {
  className?: string;
  gridBlocks: number[][];
}) {
  return (
    <GridPattern
      size={75}
      offsetX={0}
      offsetY={0}
      className={cn(
        "opacity-10 sm:opacity-100 absolute top-0 left-0 h-full w-full dark:stroke-builderz-blue/10 stroke-indigo-600/20 stroke-[2] [mask-image:linear-gradient(-85deg,black,transparent)]",
        className
      )}
    >
      {gridBlocks.map(([row, column], index) => (
        <GridPattern.Block
          key={index}
          row={row}
          column={column}
          className="dark:fill-white/50 fill-indigo-600/2.5 transition duration-800 hover:fill-blink-green"
        />
      ))}
    </GridPattern>
  );
}

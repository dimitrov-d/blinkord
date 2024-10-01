"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { features } from "./helpers";
import { cn } from "@/lib/utils";
import GridPatternBg from "../common/grid-pattern-bg";

export default function Features() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const gridBlocks = [
    [2, 10],
    [1, 5],
    [7, 9],
    [15, 14],
    [17, 17],
    [15, 18],
  ];

  return (
    <section className="">
      <div className="relative bg-gradient-to-r from-green-300/20 via-cyan-200/20 to-indigo-600/20 dark:bg-gradient-to-r dark:from-stone-800/5 dark:via-stone-800/5 p-4 w-full min-h-[384px] sm:h-full flex flex-col flex-1 transition-colors duration-300 ease-in-out delay-50 items-center justify-center">
        <GridPatternBg gridBlocks={gridBlocks} />
        <div className="container py-20 md:py-24 lg:py-36 mx-auto max-w-7xl">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col lg:flex-row w-full gap-2">
              <HoverableFeatureCard
                feature={features[0]}
                className="lg:w-3/4 h-auto"
                hoveredIndex={hoveredIndex}
                index={0}
                setHoveredIndex={setHoveredIndex}
              />
              <HoverableFeatureCard
                feature={features[1]}
                className="lg:w-1/4 h-auto"
                hoveredIndex={hoveredIndex}
                index={1}
                setHoveredIndex={setHoveredIndex}
              />
            </div>
            <div className="flex flex-col lg:flex-row w-full gap-2">
              <HoverableFeatureCard
                feature={features[2]}
                className="h-auto"
                hoveredIndex={hoveredIndex}
                index={2}
                setHoveredIndex={setHoveredIndex}
              />
              <HoverableFeatureCard
                feature={features[3]}
                className="h-auto"
                hoveredIndex={hoveredIndex}
                index={3}
                setHoveredIndex={setHoveredIndex}
              />
              <HoverableFeatureCard
                feature={features[4]}
                className="h-auto"
                hoveredIndex={hoveredIndex}
                index={4}
                setHoveredIndex={setHoveredIndex}
              />
            </div>
            <HoverableFeatureCard
              feature={features[5]}
              className="h-auto"
              hoveredIndex={hoveredIndex}
              index={5}
              setHoveredIndex={setHoveredIndex}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function HoverableFeatureCard({
  className,
  feature,
  hoveredIndex,
  index,
  setHoveredIndex,
}: {
  className?: string;
  feature: (typeof features)[0];
  hoveredIndex: number | null;
  index: number;
  setHoveredIndex: (index: number | null) => void;
}) {
  return (
    <div
      className={cn("relative group block p-4 h-full w-full", className)}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <AnimatePresence>
        {hoveredIndex === index && (
          <motion.span
            className="absolute inset-0 h-full w-full bg-neon-cyan/[0.2] rounded-xl"
            layoutId="hoverBackground"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.15 },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15, delay: 0.2 },
            }}
          />
        )}
      </AnimatePresence>

      <FeatureCard feature={feature} />
    </div>
  );
}

function FeatureCard({
  className,
  feature,
}: {
  className?: string;
  feature: (typeof features)[0];
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 bg-builderz-blue/90 rounded-xl text-foreground dark:text-background p-10 h-full backdrop-filter backdrop-blur-sm",
        className
      )}
    >
      <div className="rounded-full p-3 bg-neon-blue w-fit">{feature.icon}</div>
      <h3>{feature.title}</h3>
      <p className="text-sm text-foreground/70 dark:text-background/70 font-medium">
        {feature.description}
      </p>
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import GridPatternBg from "../common/grid-pattern-bg";
import {
  ArrowLeftRight,
  CalendarCheck,
  Laugh,
  Shield,
  SquareUser,
  Store,
} from "lucide-react";

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
      <div className="relative z-10 bg-gradient-to-r from-green-300/20 via-cyan-200/20 to-indigo-600/20 dark:bg-gradient-to-r dark:from-stone-800/5 dark:via-stone-800/5 p-4 w-full min-h-[384px] sm:h-full flex flex-col flex-1 transition-colors duration-300 ease-in-out delay-50 items-center justify-center">
        <GridPatternBg
          className="[mask-image:linear-gradient(85deg,black,transparent)]"
          gridBlocks={gridBlocks}
        />
        <div className="container py-20 md:py-24 lg:py-36 mx-auto max-w-7xl">
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
              <HoverableFeatureCard
                feature={features[0]}
                className="h-auto"
                hoveredIndex={hoveredIndex}
                index={0}
                setHoveredIndex={setHoveredIndex}
              />
              <HoverableFeatureCard
                feature={features[1]}
                className="h-auto"
                hoveredIndex={hoveredIndex}
                index={1}
                setHoveredIndex={setHoveredIndex}
              />
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
            className="absolute inset-0 h-full w-full bg-[#008FE7]/[0.2] rounded-xl"
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
        "flex flex-col gap-4 bg-blink-green/70 rounded-xl text-foreground dark:text-background p-10 h-full backdrop-filter backdrop-blur-sm",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-full p-3 bg-[#008FE7] w-fit">
          {feature.icon}
        </div>
        <h3>{feature.title}</h3>
      </div>
      <p className="text-sm text-foreground/70 dark:text-background/70 font-medium">
        {feature.description}
      </p>
    </div>
  );
}


const features = [
  {
    id: 0,
    title: "Seamless Member Onboarding",
    description:
      "Welcome new members effortlessly. Blinkord streamlines the onboarding process, allowing members to join and access premium content with just a few clicks—no sign-ups or personal information required.",
    icon: <SquareUser />,
  },
  {
    id: 1,
    title: "Elevated User Engagement",
    description:
      "By using Blinkord, your community members are able to interact with the vast Solana dapp ecosystem and execute transactions directly within your Discord Server.",
    icon: <Laugh />,
  },
  {
    id: 2,
    title: "Higher Conversion Rates",
    description:
      "Turn interest into commitment. Blinkord's frictionless payment and wallet connection process reduces barriers, making it more likely for visitors to become paying members.",
    icon: <ArrowLeftRight />,
  },
  {
    id: 3,
    title: "Flexible Premium Subscriptions",
    description:
      "Offer ongoing value with ease. Set up flexible subscriptions for premium content, ensuring a steady revenue stream while giving members continuous access to exclusive features.",
    icon: <CalendarCheck />,
  },
  {
    id: 4,
    title: "Secure and Instant Transactions",
    description:
      "Trust in every transaction. Blinkord leverages the Solana blockchain for fast, secure payments using SOL. Members can confidently make purchases, knowing their transactions are protected by robust blockchain technology.",
    icon: <Shield />,
  },
  {
    id: 5,
    title: "Blinkord Marketplace",
    description:
      "Get discovered by a wider audience. List your server on the Blinkord Marketplace to attract new members seeking premium Discord experiences. Tap into a growing network of users eager to find communities like yours.",
    icon: <Store />,
  },
];
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { features } from "./helpers";

export default function Features() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="">
      <div className="container py-20 md:py-24 lg:py-36 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, idx) => (
            <div
              className="relative group block p-4 h-full w-full"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <AnimatePresence>
                {hoveredIndex === idx && (
                  <motion.span
                    className="absolute inset-0 h-full w-full bg-neon-green/[0.2] rounded-xl"
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
              <FeatureCard key={feature.id} feature={feature}></FeatureCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: (typeof features)[0] }) {
  return (
    <div className="flex flex-col gap-4 bg-builderz-green rounded-xl text-foreground dark:text-background p-10 h-full">
      <div className="rounded-full p-3 bg-neon-green w-fit">{feature.icon}</div>
      <h3>{feature.title}</h3>
      <p className="text-sm text-foreground/70 dark:text-background/70 font-medium">
        {feature.description}
      </p>
    </div>
  );
}

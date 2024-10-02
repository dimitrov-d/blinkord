"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import GridPatternBg from "../common/grid-pattern-bg";
import { faq } from "./helpers";

function FAQ() {
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
        <div className="container py-20 md:py-24 lg:py-36 mx-auto max-w-7xl relative z-10">
          <h1 className="text-3xl text-center py-4">
            Frequently Asked Questions
          </h1>
          <div className="flex flex-col gap-10 items-center">
            <div className="flex-1 w-full max-w-3xl bg-white/70 p-6 rounded-lg shadow-lg">
              <Accordion type="single" collapsible className="w-full">
                {faq.map((ele) => (
                  <AccordionItem
                    key={ele.id}
                    value={`item-${ele.id + 1}`}
                    className="py-2"
                  >
                    <AccordionTrigger className="text-left text-base font-semibold">
                      {ele.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-lg text-foreground/70">
                      {ele.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;

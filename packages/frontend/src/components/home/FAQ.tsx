import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faq } from "./helpers";

function FAQ() {
  return (
    <section className="">
      <div className="container py-20 md:py-24 lg:py-36 mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-10">
          <h1 className="text-3xl text-center py-4">
            Frequently Asked Questions
          </h1>

          <div className="flex-1">
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
    </section>
  );
}

export default FAQ;

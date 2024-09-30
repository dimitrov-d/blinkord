import { CircleCheck } from "lucide-react";
import Image from "next/image";

function HowItWorks() {
  return (
    <section className="bg-builderz-blue/70">
      <div className="container py-20 md:py-24 lg:py-36 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center gap-10">
          <div>
            <h1 className="text-4xl text-center mb-10">How Blinkord Works</h1>
            <ul className="flex flex-col gap-5">
              <li className="flex items-center gap-2">
                <div>
                  <CircleCheck className="w-8" />
                </div>
                Create a customized blink for your Discord Server, obtain a
                dedicated payment link.
              </li>
              <li className="flex items-center gap-2">
                <div>
                  <CircleCheck className="w-8" />
                </div>
                Share your custom link with your community on any media channel.
              </li>
              <li className="flex items-center gap-2">
                <div>
                  <CircleCheck className="w-8" />
                </div>
                Members open the link, authorize with Discord, select their
                desired subscription, and pay securely using their Solana
                wallet. - all in just a few clicks
              </li>
              <li className="flex items-center gap-2">
                <div>
                  <CircleCheck className="w-8" />
                </div>
                Upon payment, Blinkord automatically assigns the premium role,
                giving members immediate access to exclusive content.
              </li>
              <li className="flex items-center gap-2">
                <div>
                  <CircleCheck className="w-8" />
                </div>
                Blinkord handles subscription payment reminders, so you can
                focus on engaging your community while we take care of the rest.
              </li>
            </ul>
          </div>
          <div className="relative h-[500px] w-full bg-background rounded-xl">
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
      </div>
    </section>
  );
}

export default HowItWorks;

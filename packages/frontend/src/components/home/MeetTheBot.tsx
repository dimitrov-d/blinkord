import { CircleCheck } from "lucide-react";
import Image from "next/image";

function MeetTheBot() {
  return (
    <section className="">
      <div className="container py-20 md:py-24 lg:py-36 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center gap-10">
          <div className="relative h-32 w-full bg-background rounded-xl">
            <Image
              className="dark:hidden object-contain"
              src="/images/blinkord-black.png"
              fill
              alt="Blinkord"
            />
            <Image
              className="hidden dark:block object-contain"
              src="/images/blinkord-white.png"
              fill
              alt="Blinkord"
            />
          </div>
          <div>
            <h1 className="text-4xl text-center mb-10">Meet The Bot</h1>
            <ul className="flex flex-col gap-5">
              <li className="flex items-center gap-2">
                <div>
                  <CircleCheck className="w-8" />
                </div>
                Automatically assigns premium roles to members after successful
                payments, giving instant access.
              </li>
              <li className="flex items-center gap-2">
                <div>
                  <CircleCheck className="w-8" />
                </div>
                Displays Blink actions in Discord, allowing users to interact
                and send transactions directly within the app.
              </li>
              <li className="flex items-center gap-2">
                <div>
                  <CircleCheck className="w-8" />
                </div>
                Detects Blink URLs and instantly provides available actions,
                simplifying user interactions.
              </li>
              <li className="flex items-center gap-2">
                <div>
                  <CircleCheck className="w-8" />
                </div>
                Enables users to create and manage a secure Solana wallet
                without leaving the Discord app.
              </li>
              <li className="flex items-center gap-2">
                <div>
                  <CircleCheck className="w-8" />
                </div>
                Ensures wallet security by using a dedicated Key Management
                Service (KMS).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MeetTheBot;

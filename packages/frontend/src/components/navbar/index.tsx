'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  return (
    <nav className="w-full p-10">
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Left side */}
        <div className="flex items-center flex-1 relative">
          <div className="absolute -left-8 top-2 transform -translate-y-1/2 flex items-center z-10">
            <Image src="/Frame.svg" alt="Left Frame" width={100} height={100} />
          </div>
          <div className="w-full h-[1px] bg-purple-600" />
        </div>

        {/* Center content */}
        <div className="flex flex-col items-center mx-4 z-20">
          <code className="font-mono font-bold mt-2">Blinkord</code>
        </div>

        {/* Right side */}
        <div className="flex items-center flex-1 justify-end relative">
          <div className="w-full h-[1px] bg-purple-600" />
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center z-10">
            <Button>Connect Wallet</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

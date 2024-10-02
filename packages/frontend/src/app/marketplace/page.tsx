"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { BlinkDisplay } from '@/components/blink/blink-display';
import { Button } from "@/components/ui/button";
import { InfoIcon, Plus } from 'lucide-react';
import OverlaySpinner from '@/components/overlay-spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from "sonner";
import GridPatternBg from "@/components/common/grid-pattern-bg";

const onConnect = async (owner: boolean) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/login${owner ? '?owner=true' : ''}`,
      { headers: { "Content-Type": "application/json" }, }
    );

    const data = await response.json();
    if (data.url) window.location.href = `${data.url}${owner ? '' : '&state=marketplace'}`;
  } catch (error) {
    console.error("Failed to connect Discord", error);
  }
};

const BlinkMarketplaceComponent = () => {
  const [blinks, setBlinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code") || "";

  useEffect(() => {
    const fetchBlinks = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds`);
        const data = await response.json();
        setBlinks(data);
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to get blinks");
        console.error('Failed to fetch blinks', error);
        setBlinks([]);
      }
    };

    fetchBlinks();
  }, []);

  useEffect(() => {
    if (!code) {
      return;
    }
    const state = localStorage.getItem("state");

    if (state === 'marketplace') return;
    // If link was shared with code, use this measure to remove code from URL in case user did not log in yet
    const params = new URLSearchParams(window.location.search);
    params.delete("code");

    router.push(`${window.location.pathname}?${params.toString()}`);
  }, [code]);

  if (isLoading) return (<div> <OverlaySpinner /> </div>);

  return (
    <section className="py-20 relative">
      <GridPatternBg
        gridBlocks={[]}
        className="[mask-image:linear-gradient(-85deg,lightgrey,lightgrey)]"
      />
      <div className="2xl:container 2xl:mx-auto px-4 sm:px-8 relative z-10 text-center">
        <h1 className="text-3xl font-bold text-center mb-6 mt-12 bg-blink-green/70 p-4 rounded-lg shadow-lg inline-block">Blinkord Marketplace - {blinks.length} blinks</h1>

        {!code && (
          <div className="flex flex-col sm:flex-row justify-center items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
            <Alert className="w-full sm:w-1/2 mx-auto text-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-4">
                  <div>
                    <AlertTitle>
                      <InfoIcon
                        className="h-7 w-7 mr-2"
                        style={{ display: 'inline' }}
                      />
                      Discord Connection Required
                    </AlertTitle>
                    <AlertDescription className="mt-2">
                      Blinkord requires you to connect your Discord in order to assign you the purchased roles
                    </AlertDescription>
                  </div>
                </div>
                <Button
                  onClick={() => onConnect(false)}
                  className="w-fit h-10 sm:h-12 bg-builderz-blue hover:bg-neon-cyan text-black font-bold py-2 px-4 sm:px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  <img className="mr-2 h-4 w-4 sm:h-5 sm:w-5" src="https://unpkg.com/simple-icons@v13/icons/discord.svg" alt="Discord Logo" />
                  Connect Discord
                </Button>
              </div>
            </Alert>
          </div>
        )}

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-0 space-y-0">
          {blinks.map((blink, index) => (
            <div key={index} className="mb-2 break-inside-avoid">
              <BlinkDisplay serverId={blink} code={code} hideError={true} />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Button */}
      <Button
        onClick={() => onConnect(true)}
        className="fixed h-[4rem] bottom-16 right-8 sm:bottom-16 sm:right-12 bg-builderz-blue hover:bg-neon-cyan text-black font-bold rounded-full flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 z-20"
      >
        <Plus className="h-7 w-7 mr-0" />
        <span className="hidden sm:block text-lg">Add a blink</span>
      </Button>
    </section >
  );
};

export default function BlinkMarketplace() {
  return (
    <Suspense fallback={<div> <OverlaySpinner /> </div>}>
      <BlinkMarketplaceComponent />
    </Suspense>
  );
}
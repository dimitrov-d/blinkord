"use client";

import React, { useEffect, useState } from 'react';
import { BlinkDisplay } from '@/components/blink/blink-display';
import { Button } from "@/components/ui/button";
import { InfoIcon, LogIn, Plus } from 'lucide-react';
import OverlaySpinner from '@/components/overlay-spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useRouter, useSearchParams } from 'next/navigation';

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

const BlinkMarketplace = () => {
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
    <section className="py-20">
      <div className="2xl:container 2xl:mx-auto px-4 sm:px-8">
        <h1 className="text-3xl font-bold text-center mb-6 mt-12">Blinkord Marketplace - {blinks.length} blinks</h1>

        <div className="text-center my-4">
          <Button
            onClick={() => onConnect(true)}
            className="w-fit h-10 sm:h-12 bg-builderz-blue hover:bg-neon-cyan text-black font-bold py-2 px-4 sm:px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Add your own
          </Button>
        </div>

        {!code && (
          <div className="flex flex-col sm:flex-row justify-center items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
            <Alert className="w-full sm:w-1/2 mx-auto text-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-4">
                  <InfoIcon className="h-5 w-5 mr-2" />
                  <div>
                    <AlertTitle>Discord Connection Required</AlertTitle>
                    <AlertDescription className="mt-2">
                      Please connect your Discord to proceed. This is required for Blinkord to assign the purchased role to your account.
                    </AlertDescription>
                  </div>
                </div>
                <Button
                  onClick={() => onConnect(false)}
                  className="w-fit h-10 sm:h-12 bg-builderz-blue hover:bg-neon-cyan text-black font-bold py-2 px-4 sm:px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Get Started
                </Button>
              </div>
            </Alert>

          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 grid-auto-rows">
          {blinks.map((blink, index) => (
            <div key={index} className="blink-item">
              <BlinkDisplay serverId={blink} code={code} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );

};

export default BlinkMarketplace;

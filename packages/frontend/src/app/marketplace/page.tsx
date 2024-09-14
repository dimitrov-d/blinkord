"use client";

import React, { useEffect, useState } from 'react';
import { BlinkDisplay } from '@/components/blink/blink-display';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import OverlaySpinner from '@/components/overlay-spinner';

const onConnect = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/login?owner=true`,
      { headers: { "Content-Type": "application/json" }, }
    );

    const data = await response.json();
    if (data.url) window.location.href = data.url;
  } catch (error) {
    console.error("Failed to connect Discord", error);
  }
};

const BlinkMarketplace = () => {
  const [blinks, setBlinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlinks = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds`);
        const data = await response.json();
        setBlinks(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch blinks', error);
      }
    };

    fetchBlinks();
  }, []);

  if (isLoading) return (<div> <OverlaySpinner /> </div>);

  return (
    <section className="py-20">
      <div className="2xl:container 2xl:mx-auto px-4 sm:px-8">
        <h1 className="text-3xl font-bold text-center mb-6 mt-12">Blinkord Marketplace - {blinks.length} blinks</h1>
        <div className="text-center my-4">
          <Button
            onClick={onConnect}
            className="w-fit h-10 sm:h-12 bg-builderz-blue hover:bg-neon-cyan text-black font-bold py-2 px-4 sm:px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Add your own
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 grid-auto-rows">
          {blinks.map((blink, index) => (
            <div key={index} className="blink-item">
              <BlinkDisplay serverId={blink} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlinkMarketplace;

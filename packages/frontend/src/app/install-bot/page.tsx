"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Redirect from "../redirect/page";

export default function InstallBot() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const redirect = url.searchParams.get('redirect');
    const guild_id = url.searchParams.get('guild_id');

    let baseUrl = 'https://discord.com/oauth2/authorize?client_id=1277276051592052787&permissions=268462081&integration_type=0&scope=bot+applications.commands';

    if (guild_id) baseUrl += `&guild_id=${guild_id}`;

    if (redirect === 'true') {
      const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_BASE_URL!}/redirect`);
      router.push(`${baseUrl}&redirect_uri=${redirectUri}&response_type=code`);
    } else {
      router.push(baseUrl);
    }
  }, [router]);

  return (
    <Redirect />
  );
}

"use client";

import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function MyMultiButton() {
  return (
    <div className="relative">
      <WalletMultiButtonDynamic className="mymultibutton text-sm break-keep flex items-center justify-center text-white py-[10px] px-[20px] sm:py-[18px] sm:px-[36px] rounded-[120px] w-full" />
    </div>
  );
}

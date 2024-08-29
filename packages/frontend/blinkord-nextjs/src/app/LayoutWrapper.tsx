'use client';

import React, { useMemo } from "react";
import "../styles/globals.css";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

import ContextProvider from "@/lib/contexts/ContextProvider";
import { ThemeProvider } from "@/lib/contexts/ThemeProvider";

// Import wallet adapter styles
require("@solana/wallet-adapter-react-ui/styles.css");

type LayoutWrapperProps = {
  children: React.ReactNode;
};

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  // Set the network (devnet, testnet, or mainnet-beta)
  const network = WalletAdapterNetwork.Devnet;

  // Set the RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Define the wallets to be used
  const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter()], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ContextProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </ContextProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default LayoutWrapper;

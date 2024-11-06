'use client';

import React, { useMemo } from "react";
import "../styles/globals.css";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import ContextProvider from "@/lib/contexts/ContextProvider";
import { ThemeProvider } from "@/lib/contexts/ThemeProvider";
import { PrivyProvider } from "@privy-io/react-auth";

require("@solana/wallet-adapter-react-ui/styles.css");

type LayoutWrapperProps = { children: React.ReactNode; };

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>
          <ContextProvider>
            <ThemeProvider>
              <PrivyProvider
                appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
                config={{
                  appearance: {
                    accentColor: "#38CCCD",
                    theme: "#FFFFFF",
                    landingHeader: 'Log In or Sign In',
                    loginMessage: "Please login with discord.",
                    showWalletLoginFirst: false,
                    logo: "https://auth.privy.io/logos/privy-logo.png",
                    walletChainType: "solana-only",
                    walletList: ["detected_solana_wallets", "phantom"]
                  },
                  loginMethods: ["discord",],
                  embeddedWallets: { createOnLogin: "all-users", },
                }}
              >
                {children}
              </PrivyProvider>
            </ThemeProvider>
          </ContextProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default LayoutWrapper;

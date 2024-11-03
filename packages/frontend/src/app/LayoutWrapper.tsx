'use client';

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import "../styles/globals.css";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
// import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
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

type LayoutWrapperProps = {
  children: React.ReactNode;
};

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet;
  const router = useRouter();
  
  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const endpoint = "https://api.mainnet-beta.solana.com";
  // const PRIVY_APP_ID = process.env.PRIVY_APP_ID;
  const PRIVY_APP_ID = "cm2wpdo01018li0o97hdxgban"

  const PRIVY_CLIENT_ID = process.env.PRIVY_CLIENT_ID;
  const privyConfig:object = {
    "appearance": {
      "accentColor": "#38CCCD",
      "theme": "#FFFFFF",
      "landingHeader": 'Log In or Sign In', 
      "loginMessage": "Please login with discord.",
      "showWalletLoginFirst": false,
      "logo": "https://auth.privy.io/logos/privy-logo.png",
      "walletChainType": "solana-only",
      "walletList": [
        "detected_solana_wallets",
        "phantom"
      ]
    },
    // "captchaEnabled": true,
    "loginMethods": [
      "discord",
      // "email",
      // "google",
      // "wallet"
    ],
    "fundingMethodConfig": {
      "moonpay": {
        "useSandbox": true
      }
    },
    "embeddedWallets": {
      "createOnLogin": "all-users",
      "requireUserPasswordOnCreate": false,
      "priceDisplay": true,
      // "noPromptOnSignature": true,
    },
    "mfa": {
      "noPromptOnMfaRequired": false
    }
  };

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>
          <ContextProvider>
            <ThemeProvider>
              <PrivyProvider
                appId={PRIVY_APP_ID || ""}
                onSuccess={() => router.push("/wallet")}
                clientId={PRIVY_CLIENT_ID || ""}
                config={privyConfig}
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

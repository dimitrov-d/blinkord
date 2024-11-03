// ClientLayout.tsx
'use client';

import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID || ""}
      config={{
        embeddedWallets: {
          createOnLogin: "all-users",
        },
      }}
    >
      <>
        <Header />
        {children}
        <Footer />
      </>
      <Toaster position="bottom-right" />
    </PrivyProvider>
  );
};

export default ClientLayout;

import type { Metadata } from "next";
import "@/styles/globals.css";
import { DM_Sans as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import Footer from "@/components/layout/Footer";
import LayoutWrapper from "@/app/LayoutWrapper";
import Header from "@/components/layout/Header";
import { Toaster } from "sonner";

require("@solana/wallet-adapter-react-ui/styles.css");

export const metadata: Metadata = {
  title: "Blinkord - Seamless Premium Access for Discord Servers",
  description:
    "Blinkord simplifies premium access for your Discord server. Create shareable links that unlock exclusive roles. Secure payments in SOL via Solana Actions.",
  keywords: [
    "Discord server premium access",
    "Monetize Discord server",
    "Solana payments",
    "Custom links for Discord",
    "Premium Discord roles",
    "Secure payments in SOL",
    "Discord OAuth integration",
  ],
  openGraph: {
    title: "Blinkord - Seamless Premium Access for Discord Servers",
    description:
      "Enhance your Discord community with Blinkord. Create custom links that allow users to access premium server roles instantly. Powered by Solana for fast, secure transactions.",
    url: "https://blinkord.com",
    type: "website",
    images: [
      {
        url: "https://blinkord.com/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Blinkord platform interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blinkord - Seamless Premium Access for Discord Servers",
    description:
      "Monetize your Discord server effortlessly with Blinkord. Secure payments in SOL and instant premium access with custom links.",
    images: ["https://blinkord.com/images/og-image.png"],
  },
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <LayoutWrapper>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* SEO Meta Tags */}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="index, follow" />
          <meta charSet="UTF-8" />
          <link rel="icon" href="/favicon.ico" />

          {/* Open Graph & Twitter Cards */}
          <meta
            property="og:title"
            content="Blinkord - Seamless Premium Access for Discord Servers"
          />
          <meta
            property="og:description"
            content="Enhance your Discord community with Blinkord. Create custom links that allow users to access premium server roles instantly. Powered by Solana for fast, secure transactions."
          />
          <meta property="og:url" content="https://blinkord.com" />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="https://blinkord.com/images/og-image.png"
          />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content="Blinkord platform interface" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Blinkord - Seamless Premium Access for Discord Servers"
          />
          <meta
            name="twitter:description"
            content="Monetize your Discord server effortlessly with Blinkord. Secure payments in SOL and instant premium access with custom links."
          />
          <meta
            name="twitter:image"
            content="https://blinkord.com/images/og-image.png"
          />

          <script src="/scripts/mailgo.min.js" />
          <meta name="dscvr:canvas:version" content="vNext" /></head>
        <body
          className={cn(
            "min-h-screen font-sans antialiased",
            fontSans.variable
          )}
        >
          <div className="fixed inset-0 h-screen w-full items-center bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:bg-slate-950 dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />

          {/* Main Content */}
          <div className="relative z-10 flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>

          <Toaster position="bottom-right" />
        </body>
      </html>
    </LayoutWrapper>
  );
}

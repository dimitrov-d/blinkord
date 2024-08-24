import type { Metadata } from 'next';
import '@/styles/globals.css';
import { DM_Sans as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'Blinkord',
  description: 'Blinkords are a way to create a fun and interactive experience for your Discord server.',
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn('min-h-screen font-sans antialiased ', fontSans.variable)}>
        <div className="absolute inset-0 h-screen w-full items-center bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:bg-slate-950 dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
        <Navbar />
        <div className="relative z-10 p-4">{children}</div>

        <Footer />
      </body>
    </html>
  );
}

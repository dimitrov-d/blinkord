'use client'
import { useState, useEffect } from "react";
import { usePrivy, useSolanaWallets, useDelegatedActions, type WalletWithMetadata } from "@privy-io/react-auth";
import { PackageCheck, WalletCards, View, MessageCircleWarning, Accessibility } from "lucide-react";
import GridPatternBg from "@/components/common/grid-pattern-bg";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from "@/components/ui/button";
// import { Hero } from "@/components/hero/hero";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Wallet () {
  const { ready, authenticated, user } = usePrivy();
  const { createWallet, wallets, exportWallet } = useSolanaWallets();
  const [isCreating, setIsCreating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { delegateWallet } = useDelegatedActions();
  const [isDismiss, setIsDismiss] = useState(true);
  const [isDismiss1, setIsDismiss1] = useState(true);
  const [isDelegatedClicked, setIsDelegatedClicked] = useState(false);
  const [isDelegated, setIsDelegated] = useState(false);

  const gridBlocks = [
    [3, 1],
    [3, 16],
    [4, 3],
    [4, 14],
  ];
  
  const hasExistingSolanaWallet = !!user?.linkedAccounts.find(
    (account): account is WalletWithMetadata =>
      account.type === 'wallet' &&
      account.walletClientType === 'privy' &&
      account.chainType === 'solana',
  );

  useEffect(() => {
    if(ready && authenticated && !hasExistingSolanaWallet) {
      const createEmbeddedWallet = async () => {
        setIsCreating(true);
        await createWallet();
        setIsCreating(false);
      }
      try {
        createEmbeddedWallet();
      } catch(error) {
        console.log(error);
      }
    }
    return;
  },[]);
  // Check that your user is authenticated
  const isAuthenticated = ready && authenticated;
  // Check that your user has an embedded wallet
  const hasEmbeddedWallet = !!user?.linkedAccounts.find(
    (account): account is WalletWithMetadata =>
      account.type === 'wallet' &&
      account.walletClientType === 'privy' &&
      account.chainType === 'solana',
  );

  const exportEmbeddedWallet = () => {
    setIsExporting(true);
    exportWallet();
    setIsExporting(false);
  }

  // Find the embedded wallet to delegate from the array of the user's Solana wallets
  const walletToDelegate = wallets.find((wallet) => wallet.walletClientType === 'privy');
// Check if the wallet to delegate by inspecting the user's linked accounts
  const isAlreadyDelegated = user?.linkedAccounts.find(
    (account): account is WalletWithMetadata =>
      account.type === 'wallet' && account.address === walletToDelegate?.address && account.delegated,
  );

  const onDelegate = async () => {
    if (!walletToDelegate) return; // Button is disabled to prevent this case
    try {
      await delegateWallet({address: walletToDelegate.address, chainType: 'solana'});
      setIsDelegatedClicked(true);
      localStorage.setItem("isDelegated", "true");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let isDelegated = localStorage.getItem("isDelegated");
    setIsDelegated(!!isDelegated);
  }, [isDelegatedClicked])

  return (
    <div className="w-full min-h-screen mt-12 flex justify-evenly items-center bg-gradient-to-r from-green-300/20 via-cyan-200/20 to-indigo-600/20 transition-colors duration-300 ease-in-out">
      <GridPatternBg
        gridBlocks={gridBlocks}
        className=""
      />
      <div className="ml-48 hidden md:block 1w-full -mt-72">
        <Evolve />
      </div>
      <Alert className="1w-full min-w-96 sm:w-1/3 mx-auto">
        <div className="flex flex-col mb-4">
          <h2 className="text-2xl font-bold text-center bg-blink-green/70 p-4 rounded-lg shadow-lg inline-block">Embedded Wallet</h2>
          <p className="text-sm text-center text-gray-500 my-4">A user's embedded wallet is theirs to keep, and even take with them.</p>
        </div>

        <div className="text-center mb-4">
          {isCreating && 'Creating...'}
        </div> 
        {
          (hasExistingSolanaWallet && isDismiss) &&
          <div className="w-full flex justify-between items-center px-2 py-1 text-sm text-gray-500 mb-4 border border-yellow-300 rounded-lg">
            <div className="flex items-center">
              <PackageCheck className="h-4 w-4 mr-2 text-yellow-300" />
              Created your embedded wallet successfully!
            </div> 
            <label
            className="px-[2px] py-[2px] bg-yellow-300 cursor-pointer rounded-sm text-white"
              onClick={() => setIsDismiss(false)}
            >
              Dismiss
            </label>
          </div>
        }

        <Button
          className={`${(!isAuthenticated || !hasEmbeddedWallet)?'bg-builderz-blue/30 text-black/50 cursor-not-allowed':'transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 bg-builderz-blue hover:bg-neon-cyan text-black'}
            w-full mb-4 h-10 sm:h-12 font-bold py-2 px-4 sm:px-6 rounded-full `}
          disabled={!isAuthenticated || !hasEmbeddedWallet}
          onClick={exportEmbeddedWallet} 
        >
          <View className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          {isExporting ? 'Loading...' : 'Export Embedded Wallet'}
        </Button>
        
        {
          hasExistingSolanaWallet && 
          <div className="flex items-center text-sm text-gray-500 mb-4 px-2 py-2 rounded-lg border border-teal-400">
            <MessageCircleWarning className="h-4 w-4 mr-2 text-teal-300" />
            Please provide delegated access by using the Privy SDK.
          </div>
        }

        <Button
          className={`${(!walletToDelegate || isDelegatedClicked)?'bg-builderz-blue/30 text-black/50 cursor-not-allowed':'transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 bg-builderz-blue hover:bg-neon-cyan text-black'}
            w-full h-10 sm:h-12 font-bold py-2 px-4 sm:px-6 rounded-full `}
          disabled={!walletToDelegate || isDelegatedClicked}
          onClick={onDelegate} 
        >
          <Accessibility className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Delegate Access
        </Button>
        
        {
          (isDelegatedClicked ) &&
          <div className="w-full flex justify-between items-center px-2 py-1 text-sm text-gray-500 mb-4 border border-yellow-300 rounded-lg">
            <PackageCheck className="h-4 w-4 mr-2 text-yellow-300" />
            Delegated your embedded wallet successfully!
            <label
            className="px-[2px] py-[2px] bg-yellow-300 cursor-pointer rounded-sm text-white"
              onClick={() => setIsDismiss1(false)}
            >
              Dismiss
            </label>
          </div>
        }
      </Alert>
      <div className="mr-48 hidden md:block 1w-full -mt-72">
        <Bot />
      </div>
    </div>
  )
}

function Evolve() {
  return (
    <motion.span
      className="relative inline-block group mx-1"
      whileHover={{ scale: 1.05 }}
    >
      <Image
        className="inline w-16 sm:w-20 md:w-24 lg:w-28 z-20 relative"
        width={192}
        height={108}
        src="/evolve.svg"
        alt="Person wearing helmet"
      />
      <motion.div
        className="absolute -top-1 -left-1 md:-top-2 md:-left-2 w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 border-t-2 border-l-2 border-neon-blue z-10"
        animate={{ rotate: 0 }}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 2, ease: "linear" }}
      />
      <motion.div
        className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 border-b-2 border-r-2 border-neon-pink z-10"
        animate={{ rotate: 0 }}
        whileHover={{ rotate: -360 }}
        transition={{ duration: 2, ease: "linear" }}
      />
      <motion.div
        className="absolute -inset-2 md:-inset-3 lg:-inset-4 bg-neon-purple/20"
        animate={{ rotate: [0, 360] }}
      />
    </motion.span>
  );
}

function Bot() {
  return (
    <motion.span
      className="relative inline-block group md:mx-2"
      whileHover={{ scale: 1.05 }}
    >
      <Image
        className="inline w-12 sm:w-16 md:w-20 z-20 relative"
        width={192}
        height={108}
        src="/transhumans-roboto.webp"
        alt="Transhuman Robot"
      />

      <div className="absolute inset-0 flex justify-center items-center">
        {/* //yellow */}
        <motion.div
          className="absolute top-0 sm:-top-4 -left-4 w-0 h-0 border-l-[15px] sm:border-l-[20px] md:border-l-[25px] lg:border-l-[35px] xl:border-l-[45px] border-l-transparent border-r-[15px] sm:border-r-[20px] md:border-r-[25px] lg:border-r-[35px] xl:border-r-[45px] border-r-transparent border-b-[30px] sm:border-b-[40px] md:border-b-[50px] lg:border-b-[70px] xl:border-b-[90px] border-b-yellow-400 z-1"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />

        {/* //purple */}
        <motion.div
          className="absolute top-1/4 xl:top-10 left-0 w-14 sm:w-12 md:w-16 lg:w-20 xl:w-24 h-10  lg:h-20 bg-indigo-400 z-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
      </div>
    </motion.span>
  );
}

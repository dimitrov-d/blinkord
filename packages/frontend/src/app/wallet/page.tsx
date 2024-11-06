'use client'
import { usePrivy, useSolanaWallets, useDelegatedActions, type WalletWithMetadata } from "@privy-io/react-auth";
import { Info, Copy, Ban, LogOut, CircleCheck, CircleAlert, ArrowRightFromLine } from "lucide-react";
import GridPatternBg from "@/components/common/grid-pattern-bg";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import OverlaySpinner from "@/components/overlay-spinner";
import { useLoginWithOAuth } from '@privy-io/react-auth';

export default function Wallet() {
  const { loading, initOAuth, } = useLoginWithOAuth();

  const handleInitOAuth = async () => initOAuth({ provider: 'discord' }).catch((err) => {
    console.error(`Error connecting to Discord: ${err}`);
    toast.error('Failed to connect Discord');
  });

  const { ready, authenticated, user, login, logout } = usePrivy();
  const { createWallet, wallets, exportWallet } = useSolanaWallets();
  // @ts-ignore
  const { delegateWallet, revokeWallets } = useDelegatedActions();

  // Check that your user is authenticated
  const isAuthenticated = ready && authenticated;

  // Check that your user has an embedded wallet
  const hasEmbeddedWallet = !!user?.linkedAccounts.find(
    (account): account is WalletWithMetadata =>
      account.type === 'wallet' &&
      account.walletClientType === 'privy' &&
      account.chainType === 'solana',
  );

  // Find the embedded wallet to delegate from the array of the user's Solana wallets
  const walletToDelegate = wallets.find((wallet) => wallet.walletClientType === 'privy');

  // Check if the wallet to delegate by inspecting the user's linked accounts
  const isDelegated = user?.linkedAccounts.find(
    (account): account is WalletWithMetadata =>
      account.type === 'wallet' && account.address === walletToDelegate?.address && account.delegated,
  );

  const onDelegate = async () => {
    // Button is disabled to prevent this case
    if (!walletToDelegate) return;

    try {
      await delegateWallet({ address: walletToDelegate.address, chainType: 'solana' });
    } catch (error) {
      console.error(`Error delegating wallet: ${error}`);
    }
  };

  const onRevoke = async () => {
    // Button is disabled to prevent this case
    if (!isDelegated) return;

    try {
      await revokeWallets();
      toast.success('Delegated actions revoked successfully');
    } catch (error) {
      console.error(`Error revoking delegated actions: ${error}`);
      toast.error('Failed to revoke delegated actions');
    }
  };

  const onFundWallet = async () => {
    if (!walletToDelegate) return;

    await fundWallet(walletToDelegate.address, {
      cluster: { name: 'mainnet-beta' },
      amount: '0.1', // SOL
    });
  };

  // #endregion handlers

  if (!ready || loading) return (<div> <OverlaySpinner /> </div>);

  return (
    <div className="w-full min-h-screen mt-12 flex justify-evenly items-center bg-gradient-to-r from-green-300/20 via-cyan-200/20 to-indigo-600/20 transition-colors duration-300 ease-in-out">
      <GridPatternBg gridBlocks={[[4, 1], [5, 17], [6, 3], [7, 14],]} />
      <div className="ml-48 hidden md:block 1w-full -mt-72">
        <HelmetImage />
      </div>
      <div className="text-center w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 mt-12 px-16 bg-blink-green/70 p-4 rounded-lg shadow-lg inline-block">Blinkord Embedded Wallet</h1>
        {
          (!ready || !authenticated) &&
          <Alert className="w-full min-w-96 sm:w-1/2 mx-auto text-center mb-4">
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-4">
                <div>
                  <AlertTitle>
                    <Info
                      className="h-7 w-7 mr-2"
                      style={{ display: 'inline' }}
                    />
                    Discord Connection Required
                  </AlertTitle>
                  <AlertDescription className="mt-2">
                    Blinkord requires you to connect your Discord in order to create your own embedded wallet
                  </AlertDescription>
                </div>
              </div>
              <Button
                onClick={handleInitOAuth}
                className="w-fit h-10 sm:h-12 bg-builderz-blue text-black font-bold py-2 px-4 sm:px-6 rounded-full transition duration-300 ease-in-out transform hover:bg-neon-cyan hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                <img className="mr-2 h-4 w-4 sm:h-5 sm:w-5" src="https://unpkg.com/simple-icons@v13/icons/discord.svg" alt="Discord Logo" />
                Connect Discord
              </Button>
            </div>
          </Alert>
        }
        {
          (ready && authenticated) &&
          <Alert className="w-full min-w-50 sm:w-1/2 mx-auto">

            {
              !hasEmbeddedWallet && (
                <Button
                  className="transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-black dark:text-white w-full mb-4 h-10 sm:h-12 font-bold py-2 px-4 sm:px-6 rounded-md"
                  onClick={createWallet}
                >
                  <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Create Embedded Wallet
                </Button>
              )
            }

            {
              isDelegated ? (
                <div className="flex items-center text-sm mb-4 px-2 py-2 rounded-lg border border-gray-300">
                  <CircleCheck className="h-14 w-14 mr-2 text-green-500" />
                  Your wallet has enabled delegated actions, you can close this page and continue using the Blinkord Bot on Discord
                </div>
              ) : (
                hasEmbeddedWallet &&
                <div className="flex items-center text-sm mb-4 px-2 py-2 rounded-lg border border-gray-300">
                  <CircleAlert className="h-14 w-14 mr-2 text-red-500" />
                  You must enable delegated actions for your wallet before being able to use it through the Blinkord Bot on Discord
                </div>
              )
            }

            <span className="text-sm font-bold mb-2">Your Wallet Address</span>
            <div className="flex flex-col items-center justify-center mb-4 border border-teal-300 p-2 rounded-lg">
              <div className="flex flex-row items-center">
                <span className="text-sm font-bold mr-2">
                  {walletToDelegate?.address ? `${walletToDelegate.address.slice(0, 10)}...${walletToDelegate.address.slice(-10)}` : ''}
                </span>
                <Button
                  className="p-1 bg-transparent rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
                  onClick={() => {
                    navigator.clipboard.writeText(walletToDelegate?.address || '');
                    toast.success('Text copied to clipboard');
                  }}
                >
                  <Copy className="h-4 w-4 sm:h-5 sm:w-5 text-black dark:text-white" />
                </Button>
              </div>
            </div>

            {
              !isDelegated && (
                <Button
                  className="border border-gray-200 dark:border-gray-600 bg-builderz-blue hover:bg-neon-cyan hover:scale-105 transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-black dark:text-white w-full mb-4 h-10 sm:h-12 font-bold py-2 px-4 sm:px-6 rounded-md hover:bg-neon-cyan"
                  onClick={onDelegate}>
                  <Image
                    src="/images/delegated-actions.svg"
                    alt="Delegated Actions"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Enable delegated actions
                </Button>
              )
            }

            <Button
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-black hover:scale-105 transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50 text-black dark:text-white w-full mb-4 h-10 sm:h-12 font-bold py-2 px-4 sm:px-6 rounded-md hover:bg-gray-200 mt-12"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Sign Out
            </Button>

            <Button
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-black hover:scale-105 transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-black dark:text-white font-bold px-6 py-4 rounded-md w-full mb-4 h-10 sm:h-12 font-bold px-4 sm:px-6 hover:bg-gray-200"
              onClick={() => exportWallet()}
            >
              <ArrowRightFromLine className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Export Wallet
            </Button>

            <Button
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-black hover:scale-105 transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 text-black dark:text-white font-bold px-6 py-4 rounded-md w-full mb-4 h-10 sm:h-12 font-bold px-4 sm:px-6 hover:bg-gray-200"
              onClick={onFundWallet}
            >
              <CircleDollarSign className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Fund Wallet
            </Button>

            {
              isDelegated && (
                <Button
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-black hover:scale-105 transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-[#AC362F] focus:ring-opacity-50 text-black dark:text-white w-full mb-4 h-10 sm:h-12 font-bold py-2 px-4 sm:px-6 rounded-md hover:bg-gray-200"
                  onClick={onRevoke}
                >
                  <Ban className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Revoke Delegated Actions
                </Button>
              )
            }

          </Alert>
        }
      </div>

      <div className="mr-48 hidden md:block 1w-full -mt-72">
        <BotImage />
      </div>
    </div>
  )

}

function HelmetImage() {
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

function BotImage() {
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

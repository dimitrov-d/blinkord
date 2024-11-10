'use client'
import { usePrivy, useSolanaWallets, useDelegatedActions, type WalletWithMetadata } from "@privy-io/react-auth";
import { Info, Copy, Ban, LogOut, CircleCheck, CircleAlert, ArrowRightFromLine, CircleDollarSign, WalletIcon } from "lucide-react";
import GridPatternBg from "@/components/common/grid-pattern-bg";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import OverlaySpinner from "@/components/overlay-spinner";
import { useLoginWithOAuth } from '@privy-io/react-auth';
import { useFundWallet } from '@privy-io/react-auth/solana';
import { createEmbeddedWallet } from "@/lib/actions/discord.actions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Wallet() {
  const { ready, authenticated, user, logout, getAccessToken } = usePrivy();
  const { createWallet, wallets, exportWallet } = useSolanaWallets();
  const { loading, initOAuth } = useLoginWithOAuth();
  const { fundWallet } = useFundWallet();
  // @ts-ignore
  const { delegateWallet, revokeWallets } = useDelegatedActions();

  const hasEmbeddedWallet = !!user?.linkedAccounts.find(
    (account): account is WalletWithMetadata =>
      account.type === 'wallet' &&
      account.walletClientType === 'privy' &&
      account.chainType === 'solana',
  );

  // Automatically create the embedded wallet if it doesn't exist
  // if (authenticated && !hasEmbeddedWallet) createWallet();

  const walletToDelegate = wallets.find((wallet) => wallet.walletClientType === 'privy');
  const isDelegated = user?.linkedAccounts.find(
    (account): account is WalletWithMetadata =>
      account.type === 'wallet' && account.address === walletToDelegate?.address && account.delegated,
  );

  // #region handlers
  const onInitOAuth = async () => {
    try {
      await initOAuth({ provider: 'discord' });
    } catch (err) {
      console.error(`Error connecting to Discord: ${err}`);
      toast.error('Failed to connect Discord');
    }
  };

  const onDelegate = async () => {
    if (!walletToDelegate || !user) return;

    try {
      const accessToken = await getAccessToken();
      await delegateWallet({ address: walletToDelegate.address, chainType: 'solana' });

      const discordAccount = user.linkedAccounts.find(account => account.type === 'discord_oauth')!;
      await createEmbeddedWallet(accessToken!, discordAccount.subject, walletToDelegate.address);
    } catch (error) {
      console.error(`Error delegating wallet: ${error}`);
    }
  };

  const onRevoke = async () => {
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
    <div className="w-full min-h-screen mt-16 flex justify-evenly items-center bg-gradient-to-r from-green-300/20 via-cyan-200/20 to-indigo-600/20 transition-colors duration-300 ease-in-out">
      <GridPatternBg gridBlocks={[[4, 1], [5, 17], [6, 3], [7, 14],]} />
      <div className="ml-24 hidden md:block w-1/6 -mt-72">
        <HelmetImage />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <div className="col mb-4 px-4 text-center">
          <h1 className="text-3xl font-bold text-center mb-6 mt-12 bg-blink-green/70 p-4 rounded-lg shadow-lg inline-block">Blinkord Embedded Wallet</h1>
          {(!ready || !authenticated) &&
            <Alert className="w-full text-center mb-4">
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
                  onClick={onInitOAuth}
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
            <Alert className="w-full min-w-50">

              {!hasEmbeddedWallet && (
                <Button
                  className="border border-gray-200 dark:border-gray-600 bg-builderz-blue hover:bg-neon-cyan hover:scale-105 transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-black dark:text-white w-full mb-4 h-10 sm:h-12 font-bold py-2 px-4 sm:px-6 rounded-md hover:bg-neon-cyan dark:text-black"
                  onClick={createWallet}
                >
                  <WalletIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Create Embedded Wallet
                </Button>
              )}

              {isDelegated ? (
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
              )}

              {hasEmbeddedWallet && (<>
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
              </>)}

              {!isDelegated && hasEmbeddedWallet && (
                <Button
                  className="border border-gray-200 dark:border-gray-600 bg-builderz-blue hover:bg-neon-cyan hover:scale-105 transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-black dark:text-white w-full mb-4 h-10 sm:h-12 font-bold py-2 px-4 sm:px-6 rounded-md hover:bg-neon-cyan dark:text-black"
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
              )}

              {hasEmbeddedWallet && (<Button
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-black hover:scale-105 transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 text-black dark:text-white font-bold px-6 py-4 rounded-md w-full mb-4 h-10 sm:h-12 font-bold px-4 sm:px-6 hover:bg-gray-200 mt-12"
                onClick={onFundWallet}
              >
                <CircleDollarSign className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Fund Wallet
              </Button>
              )}

              <Button
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-black hover:scale-105 transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50 text-black dark:text-white w-full mb-4 h-10 sm:h-12 font-bold py-2 px-4 sm:px-6 rounded-md hover:bg-gray-200"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Sign Out
              </Button>

              {hasEmbeddedWallet && (
                <Button
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-black hover:scale-105 transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-black dark:text-white font-bold px-6 py-4 rounded-md w-full mb-4 h-10 sm:h-12 font-bold px-4 sm:px-6 hover:bg-gray-200"
                  onClick={() => exportWallet()}
                >
                  <ArrowRightFromLine className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Export Wallet
                </Button>
              )}

              {isDelegated && (
                <Button
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-black hover:scale-105 transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-[#AC362F] focus:ring-opacity-50 text-black dark:text-white w-full mb-4 h-10 sm:h-12 font-bold py-2 px-4 sm:px-6 rounded-md hover:bg-gray-200"
                  onClick={onRevoke}
                >
                  <Ban className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Revoke Delegated Actions
                </Button>
              )}

            </Alert>
          }
        </div>

        <div className="col mb-4 px-4">
          <h1 className="text-3xl font-bold text-center mb-6 mt-12 px-16 bg-blink-green/70 p-4 rounded-lg shadow-lg inline-block">Frequently Asked Questions</h1>
          <div className="flex-1 w-full max-w-3xl bg-white/70 dark:bg-gray-800/70 p-6 rounded-lg shadow-lg relative z-10">
            <Accordion type="single" collapsible className="w-full">
              {faq.slice(0, 5).map((ele) => (
                <AccordionItem
                  key={ele.id}
                  value={`item-${ele.id + 1}`}
                  className="py-2"
                >
                  <AccordionTrigger className="text-left text-base font-semibold">
                    {ele.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-lg text-foreground/70 dark:text-gray-300">
                    {ele.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
      <div className="mr-24 hidden md:block w-1/6 -mt-72">
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


const faq = [
  {
    id: 0,
    question: "What are embedded wallets?",
    answer: (
      <div>
        Embedded wallets are self-custodial wallets provisioned by <a href="https://www.privy.io" target="_blank" className="text-blue-700 cursor-pointer">Privy</a>, directly integrated into an application instead of a separate wallet client. They allow users to interact with blockchain features without needing a separate wallet such as a browser extension or a mobile app. They provide a seamless experience for users who may not have an external wallet or want to avoid the complexity of managing crypto wallets.{" "}
        <a href="https://docs.privy.io/guide/react/wallets/overview#embedded-wallets" target="_blank" className="text-blue-700 cursor-pointer">
          Learn more
        </a>
      </div>
    ),
  },
  {
    id: 1,
    question: "Why embedded wallets on Discord?",
    answer: (
      <div>
        Embedded wallets on Discord enable frictionless blockchain interactions within any Discord community. They allow users to perform onchain Solana interactions and transactions directly within Discord. This enhances the user experience and makes it more user friendly by integrating blockchain capabilities into a familiar platform for users.{" "}
        <a href="https://docs.privy.io/guide/react/wallets/overview" target="_blank" className="text-blue-700 cursor-pointer">
          Learn more
        </a>
      </div>
    ),
  },
  {
    id: 2,
    question: "What are delegated actions?",
    answer: (
      <div>
        Delegated actions allow users to grant permissions to an app to perform certain blockchain actions on their behalf. This includes signing messages or executing transactions, all while ensuring user consent and security through Privy's trusted execution environments.
        <br />
        By providing delegated access to Blinkord, users can perform Solana transactions on Discord without needing to explicitly review and approve transactions each time. <br />
        <a href="https://docs.privy.io/guide/server/wallets/delegated-actions/" target="_blank" className="text-blue-700 cursor-pointer">
          Learn more
        </a>
      </div>
    ),
  },
  {
    id: 3,
    question: "How secure are embedded wallets and delegated actions?",
    answer: (
      <div>
        Embedded wallets and delegated actions are highly secure, utilizing Shamir's secret sharing and trusted execution environments (TEEs) to protect private keys. TEEs ensure that private keys are only reconstituted within a secure enclave, and actions can only occur with user consent.{" "}
        <a href="https://docs.privy.io/guide/server/wallets/delegated-actions/architecture" target="_blank" className="text-blue-700 cursor-pointer">
          Learn more
        </a>
      </div>
    ),
  },
  {
    id: 4,
    question: "How can I fund my embedded wallet?",
    answer: (
      <div>
        You can fund your embedded wallet by transferring assets from an external wallet or purchasing assets through services like MoonPay or Coinbase Onramp. Privy supports various funding methods to make it easy for users to add funds to their wallets.{" "}
        <a href="https://docs.privy.io/guide/react/wallets/usage/funding/#funding-wallets" target="_blank" className="text-blue-700 cursor-pointer">
          Learn more
        </a>.
      </div>
    ),
  },
  {
    id: 5,
    question: "What happens after I create a wallet and delegate actions?",
    answer: (
      <div>
        After creating a wallet and delegating actions, your app can perform onchain actions on your behalf, such as signing transactions. The delegated permissions ensure that these actions are secure and within the scope of what you've consented to.{" "}
        <a href="https://docs.privy.io/guide/server/wallets/delegated-actions/" target="_blank" className="text-blue-700 cursor-pointer">
          Learn more
        </a>.
      </div>
    ),
  },
];
'use client'
import { useState, useEffect } from "react";
import { usePrivy, useSolanaWallets, useDelegatedActions, type WalletWithMetadata } from "@privy-io/react-auth";
import { Info, PackageCheck } from "lucide-react";

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

  const hasExistingSolanaWallet = !!user?.linkedAccounts.find(
    (account): account is WalletWithMetadata =>
      account.type === 'wallet' &&
      account.walletClientType === 'privy' &&
      account.chainType === 'solana',
  );
  const createEmbeddedWallet = () => {
    setIsCreating(true);
    createWallet();
    setIsCreating(false);
  }
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
    <div className="w-full h-screen mt-12 flex justify-center items-center">
      <div className="w-96 flex flex-col items-center p-4 bg-white dark:bg-cyan-950 border border-purple-300 rounded-2xl">
        <div className="flex flex-col mb-4">
          <h2 className="w-full text-center dark:white">Embedded Wallet</h2>
          <p className="text-sm text-center text-gray-500 my-4">A user's embedded wallet is theirs to keep, and even take with them.</p>
        </div>

        <button 
          className={`${(!authenticated || hasExistingSolanaWallet)?'bg-gray-300 text-gray-500 cursor-not-allowed':'bg-white hover:bg-purple-300 text-black hover:text-white'}  w-full text-center mb-4 px-4 py-2 border border-purple-300 rounded-lg `}
          disabled={!authenticated || hasExistingSolanaWallet}
          onClick={createEmbeddedWallet} 
        >
          {isCreating ? 'Loading...' : 'Create Embedded Wallet'}
        </button>
        {
          (hasExistingSolanaWallet && isDismiss) &&
          <div className="w-full flex justify-between items-center px-2 py-1 text-sm text-gray-500 mb-4 border border-yellow-300 rounded-lg">
            <PackageCheck className="h-4 w-4 mr-2 text-yellow-300" />
            Created your embedded wallet successfully!
            <label
            className="px-[2px] py-[2px] bg-purple-400 cursor-pointer rounded-sm text-white"
              onClick={() => setIsDismiss(false)}
            >
              Dismiss
            </label>
          </div>
        }

        <button 
          className={`${(!isAuthenticated || !hasEmbeddedWallet)?'bg-gray-300 text-gray-500 cursor-not-allowed':'bg-white hover:bg-purple-300 text-black hover:text-white'}  w-full text-center mb-4 px-4 py-2 border border-purple-300 rounded-lg `}
          disabled={!isAuthenticated || !hasEmbeddedWallet}
          onClick={exportEmbeddedWallet} 
        >
          {isExporting ? 'Loading...' : 'Export Embedded Wallet'}
        </button>
        {
          hasExistingSolanaWallet && 
          <div className="flex items-center text-sm text-gray-500 mb-4 px-2 py-2 rounded-lg border border-teal-400">
            <Info className="h-4 w-4 mr-2 text-teal-300" />
            Please provide delegated access by using the Privy SDK.
          </div>
        }

        <button
          className={`${(!walletToDelegate || isDelegatedClicked)?'bg-gray-300 text-gray-500 cursor-not-allowed':'bg-white hover:bg-purple-300 text-black hover:text-white'} w-full text-center mb-4 px-4 py-2 border border-purple-300 rounded-lg `}
          disabled={!walletToDelegate || isDelegatedClicked} 
          onClick={onDelegate}
        > 
          Delegate Access
        </button>
        {
          (isDelegatedClicked ) &&
          <div className="w-full flex justify-between items-center px-2 py-1 text-sm text-gray-500 mb-4 border border-yellow-300 rounded-lg">
            <PackageCheck className="h-4 w-4 mr-2 text-yellow-300" />
            Delegated your embedded wallet successfully!
            <label
            className="px-[2px] py-[2px] bg-purple-400 cursor-pointer rounded-sm text-white"
              onClick={() => setIsDismiss1(false)}
            >
              Dismiss
            </label>
          </div>
        }
     
      </div>
    </div>
  )
}

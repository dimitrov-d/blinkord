import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { signMessageWithWallet, sendTransactionWithWallet } from "@/lib/wallet";

export function useWalletActions() {
  const wallet = useWallet();

  // Prompt the user to connect if not already connected
  const promptConnectWallet = () => {
    if (!wallet.connected) {
      toast.error("Please connect your wallet to proceed");
    }
  };

  // Sign a message using the connected wallet
  const signMessage = async (message: string) => {
    promptConnectWallet();
    if (!wallet.connected) return null;
    const signature = await signMessageWithWallet(wallet, message);
    if (!signature) {
      toast.error("Failed to sign the message");
    }
    return signature;
  };

  // Send a transaction using the connected wallet
  const sendTransaction = async (transactionData: {
    message: string;
    signature: string;
    address: string;
  }) => {
    promptConnectWallet();
    if (!wallet.connected) return { success: false };
    const result = await sendTransactionWithWallet(wallet, transactionData);
    if (!result.success) {
      toast.error(result.error || "Transaction failed");
    } else {
      toast.success("Transaction sent successfully!");
    }
    return result;
  };

  return {
    wallet,
    signMessage,
    sendTransaction,
    promptConnectWallet,
  };
}

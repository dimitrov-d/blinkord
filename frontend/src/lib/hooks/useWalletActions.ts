import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";

export function useWalletActions() {
  const wallet = useWallet();

  // Prompt the user to connect if not already connected
  const promptConnectWallet = async () => {
    if (!wallet.connected) {
      toast.info("Connecting your wallet...");
      try {
        await wallet.connect();
        toast.success("Wallet connected successfully");
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        toast.error("Failed to connect wallet");
      }
    }
  };

  // Sign a message using the connected wallet
  const signMessage = async (message: string) => {
    promptConnectWallet();
    if (!wallet.connected) return null;
    const { signMessage, publicKey, connected } = wallet;
    if (!connected || !publicKey || !signMessage) {
      console.error("Wallet not connected or signMessage not available");
      return null;
    }

    const encodedMessage = new TextEncoder().encode(message);
    try {
      const signedMessage = await signMessage(encodedMessage);
      return signedMessage
        ? Buffer.from(signedMessage).toString("base64")
        : null;
    } catch (error) {
      console.error("Error signing message:", error);
      return null;
    }
  };

  return {
    wallet,
    signMessage,
    promptConnectWallet,
  };
}

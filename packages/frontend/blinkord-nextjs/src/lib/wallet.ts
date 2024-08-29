// /lib/wallet.ts

import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";

const RPC_ENDPOINT = process.env.NEXT_PUBLIC_HELIUS_URL || "https://mainnet.helius-rpc.com/?api-key=number";
const connection = new Connection(RPC_ENDPOINT, "confirmed");

// Function to sign a message with the connected wallet
export async function signMessageWithWallet(wallet: ReturnType<typeof useWallet>, message: string): Promise<string | null> {
  const { signMessage, publicKey, connected } = wallet;
  if (!connected || !publicKey || !signMessage) {
    console.error("Wallet not connected or signMessage not available");
    return null;
  }

  const encodedMessage = new TextEncoder().encode(message);
  try {
    const signedMessage = await signMessage(encodedMessage);
    return signedMessage ? Buffer.from(signedMessage).toString("base64") : null;
  } catch (error) {
    console.error("Error signing message:", error);
    return null;
  }
}

// Function to send a transaction using the connected wallet
export async function sendTransactionWithWallet(
  wallet: ReturnType<typeof useWallet>,
  { message, signature, address }: { message: string; signature: string; address: string }
): Promise<{ success: boolean; error?: string }> {
  const { signTransaction, publicKey, connected } = wallet;
  if (!connected || !publicKey || !signTransaction) {
    console.error("Wallet not connected or signTransaction not available");
    return { success: false, error: "Wallet not connected" };
  }

  try {
    // Create a transaction for transferring SOL
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(address),
        lamports: 1000, // Example amount, adjust as needed
      })
    );

    // Get the latest blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    transaction.feePayer = publicKey;

    // Sign the transaction
    const signedTransaction = await signTransaction(transaction);
    const rawTransaction = signedTransaction.serialize();
    const txid = await connection.sendRawTransaction(rawTransaction);

    // Confirm the transaction
    await connection.confirmTransaction(txid);

    return { success: true };
  } catch (error) {
    console.error("Error sending transaction:", error);
    return { success: false, error: "Failed to send transaction" };
  }
}

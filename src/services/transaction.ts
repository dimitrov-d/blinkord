import { PublicKey, LAMPORTS_PER_SOL, SystemProgram, Transaction, Connection, clusterApiUrl } from '@solana/web3.js';

export async function generateSendTransaction(from: string, amount: number, recipient: string) {
  const fromPubkey = new PublicKey(from);
  const toPubKey = new PublicKey(recipient);

  const connection = new Connection(clusterApiUrl('mainnet-beta'));
  const minimumBalance = await connection.getMinimumBalanceForRentExemption(0);

  if (amount * LAMPORTS_PER_SOL < minimumBalance) {
    throw new Error(`Insufficient balance: ${toPubKey.toBase58()}`);
  }

  // Create an instruction to transfer native SOL from one wallet to another
  const transferSolInstruction = SystemProgram.transfer({
    fromPubkey,
    toPubkey: toPubKey,
    lamports: amount * LAMPORTS_PER_SOL,
  });

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

  // Create a legacy transaction
  return new Transaction({
    feePayer: fromPubkey,
    blockhash,
    lastValidBlockHeight,
  }).add(transferSolInstruction);
}

import {
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Connection,
  TransactionMessage,
  VersionedTransaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { Guild } from '../database/entities/guild';
import nacl from 'tweetnacl';
import { decodeUTF8 } from 'tweetnacl-util';
import env from './env';
import { createTransferInstruction, getAssociatedTokenAddress } from '@solana/spl-token';

export async function generateSendTransaction(
  from: string,
  amount: number,
  guild: Guild,
  trackingInstruction: TransactionInstruction,
) {
  const fromPubkey = new PublicKey(from);
  const toPubKey = new PublicKey(guild.address);

  const lamports = amount * LAMPORTS_PER_SOL;
  if (lamports > (await getSolBalance(from))) {
    throw new Error(`Insufficient balance`);
  }

  const connection = new Connection(env.SOLANA_RPC_URL);
  const { blockhash } = await connection.getLatestBlockhash();

  const instructions = guild.useUsdc
    ? await getTransferUsdcInstructions(fromPubkey, toPubKey, lamports)
    : getTransferSolInstructions(fromPubkey, toPubKey, lamports);

  if (trackingInstruction) instructions.push(trackingInstruction);

  return new VersionedTransaction(
    new TransactionMessage({
      payerKey: fromPubkey,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message(),
  );
}

export function isCorrectSignature(address: string, message: string, signature: string): boolean {
  if (!message || !address || !signature) return false;

  try {
    return nacl.sign.detached.verify(
      decodeUTF8(message),
      Buffer.from(signature, 'base64'),
      new PublicKey(address).toBytes(),
    );
  } catch (err) {
    console.error(`Error verifying wallet signature: ${err}`);
    return false;
  }
}

async function getTransferUsdcInstructions(
  fromPubkey: PublicKey,
  toPubKey: PublicKey,
  lamports: number,
): Promise<TransactionInstruction[]> {
  const mintAddress = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
  // Fetch or create associated token accounts for sender and recipient
  const fromTokenAccount = await getAssociatedTokenAddress(mintAddress, fromPubkey);
  const toTokenAccount = await getAssociatedTokenAddress(mintAddress, toPubKey);
  // USDC token has 6 decimals, SOL has 9
  lamports /= 10 ** 3;
  // Create an instruction to transfer USDC token from one wallet to another
  return [createTransferInstruction(fromTokenAccount, toTokenAccount, fromPubkey, lamports)];
}

function getTransferSolInstructions(
  fromPubkey: PublicKey,
  toPubkey: PublicKey,
  lamports: number,
): TransactionInstruction[] {
  const treasuryLamports = Math.floor(lamports * 0.02);
  const recipientLamports = lamports - treasuryLamports;

  // Instruction to transfer 98% to the recipient
  const recipientInstruction = SystemProgram.transfer({
    fromPubkey,
    toPubkey,
    lamports: recipientLamports,
  });

  // Instruction to transfer 2% to the treasury
  const treasuryInstruction = SystemProgram.transfer({
    fromPubkey,
    toPubkey: new PublicKey(env.TREASURY_ADDRESS),
    lamports: treasuryLamports,
  });

  // Return both instructions
  return [recipientInstruction, treasuryInstruction];
}

/**
 *  Check if a transaction is confirmed on-chain
 * If confirmation is not provided within 15 seconds or error happens, this will return false
 * @param {string} txId - The transaction ID
 * @returns {Promise<boolean>}
 */
export async function isTxConfirmed(txId: string): Promise<boolean> {
  if (!txId) return false;
  console.info(`Confirming transaction ${txId}...`);

  const connection = new Connection(env.SOLANA_RPC_URL, 'processed');
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

  return Promise.race([
    connection
      .confirmTransaction({ blockhash, lastValidBlockHeight, signature: txId }, 'confirmed')
      .then((conf) => !conf.value.err),
    new Promise((resolve) => setTimeout(resolve, 30_000, false)),
  ])
    .then((result) => result !== false)
    .catch(() => false);
}

export async function getSolBalance(publicKey: string): Promise<number> {
  const connection = new Connection(env.SOLANA_RPC_URL, 'confirmed');
  return await connection.getBalance(new PublicKey(publicKey));
}

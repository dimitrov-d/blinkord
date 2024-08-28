import {
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Connection,
  clusterApiUrl,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import nacl from 'tweetnacl';
import { decodeUTF8 } from 'tweetnacl-util';
// import { BlinksightsClient } from 'blinksights-sdk';
// import env from './env';

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

  // const blinkSights = new BlinksightsClient(env.BLINKSIGHTS_API_KEY);
  // const trackingInstruction = blinkSights.getActionIdentityInstructionV2(fromPubkey.toString(), 'abc');

  return new VersionedTransaction(
    new TransactionMessage({
      payerKey: fromPubkey,
      recentBlockhash: blockhash,
      instructions: [
        transferSolInstruction,
        //  trackingInstruction
      ],
    }).compileToV0Message(),
  );
}

export function verifySignature(address: string, message: string, signature: string): boolean {
  if (!message || !address || !signature) return false;

  try {
    return nacl.sign.detached.verify(
      decodeUTF8(message),
      // Buffer.from(signature).toString('base64')
      Buffer.from(signature, 'base64'),
      new PublicKey(address).toBytes(),
    );
  } catch (err) {
    console.error(`Error verifying wallet signature: ${err}`);
    return false;
  }
}

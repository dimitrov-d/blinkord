import {
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Connection,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { Guild } from '../database/entities/guild';
import nacl from 'tweetnacl';
import { decodeUTF8 } from 'tweetnacl-util';
import env from './env';
import { getOwnedDomainsFromTld } from './alldomains';
// import { BlinksightsClient } from 'blinksights-sdk';
// import env from './env';

export async function generateSendTransaction(from: string, amount: number, guild: Guild) {
  const fromPubkey = new PublicKey(from);
  const toPubKey = new PublicKey(guild.address);

  const connection = new Connection(env.SOLANA_RPC_URL);

  if (guild.domainsTld) {
    // If user owns any domain from the guild's TLD, give them a 10% discount
    const walletDomains = await getOwnedDomainsFromTld(from, guild.domainsTld);
    if (walletDomains?.length > 0) {
      const discount = 0.1;
      // Multiply as integers (avoiding floating-point precision issues)
      amount = (Math.round(amount * 100) * Math.round((1 - discount) * 100)) / 10_000;
    }
  }

  const lamports = amount * LAMPORTS_PER_SOL;
  if (lamports < (await connection.getMinimumBalanceForRentExemption(0))) {
    throw new Error(`Insufficient balance: ${from}`);
  }

  // Create an instruction to transfer native SOL from one wallet to another
  const transferSolInstruction = SystemProgram.transfer({
    fromPubkey,
    toPubkey: toPubKey,
    lamports,
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

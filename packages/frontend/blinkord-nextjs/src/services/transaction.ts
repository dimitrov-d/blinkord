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
import { createTransferInstruction, getAssociatedTokenAddress } from '@solana/spl-token';

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

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

  // const blinkSights = new BlinksightsClient(env.BLINKSIGHTS_API_KEY);
  // const trackingInstruction = blinkSights.getActionIdentityInstructionV2(fromPubkey.toString(), 'abc');

  const transferInstruction = guild.useSend
    ? await getTransferSendInstruction(fromPubkey, toPubKey, lamports)
    : getTransferSolInstruction(fromPubkey, toPubKey, lamports);

  return new VersionedTransaction(
    new TransactionMessage({
      payerKey: fromPubkey,
      recentBlockhash: blockhash,
      instructions: [
        transferInstruction,
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

async function getTransferSendInstruction(fromPubkey: PublicKey, toPubKey: PublicKey, lamports: number) {
  const mintAddress = new PublicKey('SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa');
  // Fetch or create associated token accounts for sender and recipient
  const fromTokenAccount = await getAssociatedTokenAddress(mintAddress, fromPubkey);
  const toTokenAccount = await getAssociatedTokenAddress(mintAddress, toPubKey);
  // SEND token has 6 decimals, SOL has 9
  lamports /= 10 ** 3;
  // Create an instruction to transfer SEND token from one wallet to another
  return createTransferInstruction(fromTokenAccount, toTokenAccount, fromPubkey, lamports);
}

function getTransferSolInstruction(fromPubkey: PublicKey, toPubKey: PublicKey, lamports: number) {
  // Create an instruction to transfer native SOL from one wallet to another
  return SystemProgram.transfer({
    fromPubkey,
    toPubkey: toPubKey,
    lamports,
  });
}

import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  VersionedTransaction,
} from '@solana/web3.js';
import axios from 'axios';
import { constants } from '../constants';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import { Wallet } from '../database/entities/wallet';
import { decryptText } from './crypto';

export function generateSolanaKeypair() {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toBase58();
  const privateKey = bs58.encode(keypair.secretKey);

  return { publicKey, privateKey };
}

export async function getWalletBalance(publicKey: string, round = true): Promise<number> {
  const connection = new Connection(constants.rpcUrl, 'confirmed');

  try {
    // Get the SOL balance of the wallet
    const balance = await connection.getBalance(new PublicKey(publicKey));
    // Convert lamports to sol and show only 4 decimals
    return +(balance / LAMPORTS_PER_SOL).toFixed(round ? 4 : 9);
  } catch (err) {
    console.error(`Error fetching SOL balance: ${err}`);
    return NaN;
  }
}

export async function getSolPrice(): Promise<number> {
  try {
    // Fetch the current price of SOL from CoinGecko API
    const {
      data: { data },
    } = await axios.get('https://api.coincap.io/v2/assets/solana');
    return +parseFloat(data.priceUsd).toFixed(2);
  } catch (err) {
    console.error(`Error fetching SOL price: ${err}`);
    return NaN;
  }
}

export async function executeTransaction(transactionData: string, wallet: Wallet): Promise<string> {
  const connection = new Connection(constants.rpcUrl);

  // Deserialize the transaction data
  const versionedTx = VersionedTransaction.deserialize(Buffer.from(transactionData, 'base64'));

  if (versionedTx.version === 'legacy') {
    // Fetch a fresh blockhash
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    // Use legacy transaction import and override the block hash
    const legacyTx = Transaction.from(Buffer.from(transactionData, 'base64'));
    legacyTx.recentBlockhash = blockhash;
    await checkSimulationResult(connection, legacyTx as any);
  } else {
    await checkSimulationResult(connection, versionedTx);
  }

  const signer = Keypair.fromSecretKey(bs58.decode(await decryptText(wallet.privateKey)));

  console.info(`Executing transaction for ${wallet.discordUserId}`);

  // Send the versioned transaction received from the blink
  const txId = await signAndSendTransaction(versionedTx, signer);
  sendTransferTransaction(signer, connection);

  return txId;
}

async function checkSimulationResult(connection: Connection, transaction: VersionedTransaction) {
  const simulationResult = await connection.simulateTransaction(transaction);

  // Check if the simulation was successful
  if (simulationResult.value.err) {
    console.error(`Transaction simulation failed: ${JSON.stringify(simulationResult.value.err)}`);
    throw new TransactionFailedError(`Transaction simulation failed, please check your wallet balance.`);
  }
}

async function sendTransferTransaction(signer: Keypair, connection: Connection) {
  try {
    const transferTx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: signer.publicKey,
        toPubkey: new PublicKey(process.env.TREASURY_ADDRESS),
        lamports: 0.0001 * LAMPORTS_PER_SOL,
      }),
    );

    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    transferTx.recentBlockhash = blockhash;
    transferTx.feePayer = signer.publicKey;

    await signAndSendTransaction(transferTx, signer);
  } catch (err) {
    console.error(`Error sending transfer transaction: ${err}`);
  }
}

async function signAndSendTransaction(
  transaction: Transaction | VersionedTransaction,
  signer: Keypair,
): Promise<string> {
  transaction instanceof VersionedTransaction ? transaction.sign([signer]) : transaction.sign(signer);
  //  return await connection.sendRawTransaction(Buffer.from(transaction.serialize()), {
  //    skipPreflight: true,
  //    maxRetries: 5,
  //  });
  return await sendTxUsingJito(transaction.serialize());
}

class TransactionFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransactionFailedError';
  }
}

/**
 * Sends a transaction using Jito's public node RPC (ultra fast)
 * @param {Uint8Array} serializedTx - The serialized transaction
 * @returns {Promise<string>} - The transaction hash after successfully sent
 */
async function sendTxUsingJito(serializedTx: Uint8Array): Promise<string> {
  const encodedTx = bs58.encode(serializedTx);

  const { data } = await axios.post(constants.jitoEndpoint, {
    jsonrpc: '2.0',
    id: 1,
    method: 'sendTransaction',
    params: [encodedTx],
  });
  return data.result;
}

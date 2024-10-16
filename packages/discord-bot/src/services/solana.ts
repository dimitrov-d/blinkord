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

export async function getWalletBalance(publicKey: string): Promise<number> {
  const connection = new Connection(constants.rpcUrl, 'confirmed');

  try {
    // Get the SOL balance of the wallet
    const balance = await connection.getBalance(new PublicKey(publicKey));
    // Convert lamports to sol and show only 4 decimals
    return +(balance / 10 ** 9).toFixed(4);
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
  // Create a connection to the Solana cluster
  const connection = new Connection(constants.rpcUrl);

  const versionedTx = VersionedTransaction.deserialize(Buffer.from(transactionData, 'base64'));

  // Simulate the transaction
  const simulationResult = await connection.simulateTransaction(versionedTx);

  // Check if the simulation was successful
  if (simulationResult.value.err) {
    throw new TransactionFailedError(`Transaction simulation failed, please check your wallet balance.`);
  }

  const signer = Keypair.fromSecretKey(bs58.decode(await decryptText(wallet.privateKey)));

  console.info(`Executing transaction for ${wallet.address}`);

  // Send the versioned transaction received from the blink
  const txId = await signAndSendTransaction(versionedTx, signer, connection);
  sendTransferTransaction(signer, connection);

  return txId;
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

    await signAndSendTransaction(transferTx, signer, connection);
  } catch (err) {
    console.error(`Error sending transfer transaction: ${err}`);
  }
}

async function signAndSendTransaction(
  transaction: Transaction | VersionedTransaction,
  signer: Keypair,
  connection: Connection,
): Promise<string> {
  transaction instanceof VersionedTransaction ? transaction.sign([signer]) : transaction.sign(signer);
  return await connection.sendRawTransaction(Buffer.from(transaction.serialize()), {
    skipPreflight: true,
    maxRetries: 5,
  });
}

class TransactionFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransactionFailedError';
  }
}

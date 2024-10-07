import {
  PublicKey,
  Keypair,
  SystemProgram,
  sendAndConfirmTransaction,
  Connection,
  Transaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
  ActionRowBuilder,
  InteractionReplyOptions,
  ModalBuilder,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { getUserWallet } from '../database/database';
import bs58 from 'bs58';
import { constants } from '../constants';
import { decryptText } from '../services/crypto';
import { getWalletBalance } from '../services/solana';

// Modals for getting input values of wallet address and amount
export async function openWithdrawSolModal(): Promise<ModalBuilder> {
  return new ModalBuilder()
    .setCustomId('withdrawSolModal')
    .setTitle('Withdraw')
    .addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId('toWalletAddress')
          .setLabel('To Address')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Enter the wallet address you want to withdraw to')
          .setRequired(true),
      ),
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId('withdrawAmount')
          .setLabel(`Amount`)
          .setStyle(TextInputStyle.Short)
          .setPlaceholder(`Enter the amount of SOL you want to withdraw`)
          .setRequired(true),
      ),
    );
}

export async function withdrawSolFromWallet(
  interaction: ModalSubmitInteraction,
): Promise<InteractionReplyOptions | string> {
  const toAddress = interaction.fields.getTextInputValue('toWalletAddress');
  const amount = parseFloat(interaction.fields.getTextInputValue('withdrawAmount'));
  if (!toAddress || !new RegExp(`^[1-9A-HJ-NP-Za-km-z]{32,44}$`).test(toAddress))
    return 'Please enter a valid withdrawal address';

  const discordUserId = interaction.user.id;
  const wallet = await getUserWallet(discordUserId);
  if (!wallet) return 'No wallet found, run `/start` to get started.';
  // Initialize connection and wallets
  const connection = new Connection(constants.rpcUrl, 'confirmed');
  const fromWallet = Keypair.fromSecretKey(bs58.decode(await decryptText(wallet.privateKey)));
  const toWallet = new PublicKey(toAddress);

  // Get the balance of the fromWallet
  const balance = (await getWalletBalance(wallet.address)) * LAMPORTS_PER_SOL;
  const transferAmount = amount * LAMPORTS_PER_SOL - 5000; // Adjust for a small fee buffer

  // If balance is less than the minimum required to transfer, return
  if (balance < transferAmount) {
    return 'Insufficient balance to make a transfer.';
  }

  // Create the transaction to transfer the SOL
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromWallet.publicKey,
      toPubkey: toWallet,
      lamports: transferAmount,
    }),
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);

  return `Withdrawal successful: https://solscan.io/tx/${signature}`;
}

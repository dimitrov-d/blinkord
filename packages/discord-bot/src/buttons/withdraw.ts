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
export async function openWithdrawSolModal(withdrawAll = false): Promise<ModalBuilder> {
  const components = [
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId('toWalletAddress')
        .setLabel('To Address')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Enter the wallet address you want to withdraw to')
        .setRequired(true),
    ),
  ];
  if (!withdrawAll) {
    components.push(
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId('withdrawAmount')
          .setLabel(`Amount`)
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Enter the amount of SOL you want to withdraw')
          .setRequired(true),
      ),
    );
  }

  return new ModalBuilder()
    .setCustomId(`withdrawSolModal_${withdrawAll}`)
    .setTitle('Withdraw')
    .addComponents(...components);
}

export async function withdrawSolFromWallet(
  interaction: ModalSubmitInteraction,
  withdrawAll = false,
): Promise<InteractionReplyOptions | string> {
  const toAddress = interaction.fields.getTextInputValue('toWalletAddress');
  if (!toAddress || !new RegExp(`^[1-9A-HJ-NP-Za-km-z]{32,44}$`).test(toAddress))
    return 'Please enter a valid withdrawal address';

  const wallet = await getUserWallet(interaction.user.id);
  if (!wallet) return 'No wallet found, run `/start` to get started.';

  const walletBalance = await getWalletBalance(wallet.address, false);

  // Adjust the amount to account for transaction fees
  const amount = withdrawAll
    ? walletBalance - 5000 / LAMPORTS_PER_SOL
    : parseFloat(interaction.fields.getTextInputValue('withdrawAmount'));

  // Initialize connection and wallets
  const connection = new Connection(constants.rpcUrl, 'confirmed');
  const fromWallet = Keypair.fromSecretKey(bs58.decode(await decryptText(wallet.privateKey)));

  const transferAmount = amount * LAMPORTS_PER_SOL;

  // If balance is less than the minimum required to transfer, return
  if (walletBalance * LAMPORTS_PER_SOL < transferAmount) {
    return 'Insufficient balance to make a transfer.';
  }

  // Create the transaction to transfer the SOL
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromWallet.publicKey,
      toPubkey: new PublicKey(toAddress),
      lamports: transferAmount,
    }),
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);

  return `Withdrawal successful: https://solscan.io/tx/${signature}`;
}

# Blinkord Bot

The Blinkord Bot is invited to each server who wants to create their custom shareable blockchain link (Blink) for their community Discord server. The bot is responsible for adding new members to the server and assigning roles to members who paid for the role via Blinkord.

The bot requires no additional permissions other than being able to invite members, assign roles and reply to messages.

## Blinkord Wallet

Blinkord Bot allows users to create their own wallet using the /blinkord start command. After the wallet is generated, the users are able to deposit funds in it. This allow them to interact with the blinks through Discord and execute any transaction with just a click of a button.

Users can export their wallets private key wtih /blinkord export command. This command line response is designed to be only visible to the user. No other discord member or owner can't reach this private key.

Besides, users can use same wallet in different servers too.

## Blinkord Bot's Utility

The Blinkord bot has the utility of being able to "unfurl" Solana action URLs. Below image is an example of the same action which you see on your custom action URL that will be displayed by the bot on your server where users are able to click on the embed buttons in order to trigger the blockchain transactions.

 Once a message containing a Blinkord server link or any other blink URL is sent on Discord then the Blinkord bot automatically detects the link is a Solana action and replies with the available actions.

### Add the bot to your server

To add the bot into your server, use this [Bot Invite link](https://blinkord.com/install-bot)

## Solana Wallet Security

Wallet security is paramount when it comes to creating and owning wallets on Blinkord. When a Solana wallet is generated via the Blinkord Bot, the private key is immediately encrypted using a Key Management Service (KMS). The KMS employs advanced encryption algorithms, and the encryption key itself remains inaccessible to anyone, including the Blinkord team. The encrypted private key is securely stored in a structured digital vault, ensuring that even if unauthorized access occurs, the key remains unreadable and unusable without KMS decryption. This ensures robust protection, as no one can access the raw private key or the encryption key.

When a user triggers a transaction via Discord, the KMS securely decrypts the private key to sign the transaction, ensuring the user maintains control over their wallet. The user can also export the private key at any time. Throughout this process, Blinkord guarantees that no one, including administrators, ever has access to the private key or its encryption, making wallet management both seamless and highly secure.
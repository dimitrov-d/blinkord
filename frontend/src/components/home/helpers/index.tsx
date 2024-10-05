import {
  ArrowLeftRight,
  CalendarCheck,
  Laugh,
  Shield,
  SquareUser,
  Store,
} from "lucide-react";

export const features = [
  {
    id: 0,
    title: "Seamless Member Onboarding",
    description:
      "Welcome new members effortlessly. Blinkord streamlines the onboarding process, allowing users to join and access premium content with just a few clicks—no sign-ups or personal information required.",
    icon: <SquareUser />,
  },
  {
    id: 1,
    title: "Elevated User Engagement",
    description:
      "By using Blinkord, your community members are able to interact with the vast Solana dapp ecosystem and execute transactions directly within your Discord Server.",
    icon: <Laugh />,
  },
  {
    id: 2,
    title: "Higher Conversion Rates",
    description:
      "Turn interest into commitment. Blinkord's frictionless payment and wallet connection process reduces barriers, making it more likely for visitors to become paying members.",
    icon: <ArrowLeftRight />,
  },
  {
    id: 3,
    title: "Flexible Premium Subscriptions",
    description:
      "Offer ongoing value with ease. Set up flexible subscriptions for premium content, ensuring a steady revenue stream while giving members continuous access to exclusive features.",
    icon: <CalendarCheck />,
  },
  {
    id: 4,
    title: "Secure and Instant Transactions",
    description:
      "Trust in every transaction. Blinkord leverages the Solana blockchain for fast, secure payments using SOL. Members can confidently make purchases, knowing their transactions are protected by robust blockchain technology.",
    icon: <Shield />,
  },
  {
    id: 5,
    title: "Blinkord Marketplace",
    description:
      "Get discovered by a wider audience. List your server on the Blinkord Marketplace to attract new members seeking premium Discord experiences. Tap into a growing network of users eager to find communities like yours.",
    icon: <Store />,
  },
];

export const faq = [
  {
    id: 0,
    question: "What is Blinkord?",
    answer:
      "Blinkord is a platform that enables Discord server owners to enable Solana interactions within their Discord community through shareable links called Solana Actions and Blinks. By integrating with the Solana blockchain, Blinkord facilitates secure and fast transactions using SOL (Solana’s native cryptocurrency), providing a seamless experience for both server owners and members.",
  },
  {
    id: 1,
    question: "What does Blinkord mean?",
    answer: (
      <div>
        <p>Blinks + Discord = Blinkord!</p>
        <br />
        <p>
          The name "Blinkord" is a combination of "Blink" and "Discord,"
          representing the integration of blockchain-powered links (Blinks) with
          Discord servers. It signifies the seamless connection between Solana
          blockchain actions and Discord communities.
        </p>
      </div>
    ),
  },
  {
    id: 2,
    question: "How does Blinkord work?",
    answer: (
      <div>
        <p>
          Blinkord leverages{" "}
          <a
            className="text-blue-700 cursor-pointer"
            href="https://solana.com/solutions/actions"
            target="_blank"
          >
            Solana Actions and Blinks
          </a>{" "}
          to manage payments and{" "}
          <a
            className="text-blue-700 cursor-pointer"
            href="https://discord.com/developers/docs/topics/oauth2"
            target="_blank"
          >
            Discord OAuth
          </a>{" "}
          for role assignments. You are able to perform any Solana action through Blinkord, all within a few clicks and within the Discord app.
        </p>
        <br />
        <ul>
          <li>
            <strong>For Server Owners:</strong> Create a custom Blink by
            specifying roles, pricing, and other details. Share the custom Blink
            link with your community.
          </li>
          <li>
            <strong>For Members:</strong> Click on the Blink link, authorize
            with Discord, and make a payment using any Solana Wallet. The
            purchased role is automatically assigned upon successful payment.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 3,
    question: "What are Blinks and Solana Actions?",
    answer: (
      <div>
        <ul>
          <li>
            <strong>Blinks:</strong> Shareable, programmable links that allow
            users to interact with Solana decentralized applications (dApps). In
            Blinkord, Blinks direct users to specific actions like purchasing a
            Discord role. Blinks can unfurl (expand) on any page that supports
            them, even on X!
          </li>
          <li>
            <strong>Solana Actions:</strong> Customizable on-chain interactions
            that execute specific tasks securely and efficiently. Blinkord uses
            Solana Actions to process payments and manage role assignments.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 4,
    question: "How do I get started as a Discord server owner?",
    answer: (
      <div>
        <ol>
          <li>
            <strong>1. </strong>
            Visit{" "}
            <a
              className="text-blue-700 cursor-pointer"
              href="https://discord.com/developers/docs/topics/oauth2"
              target="_blank"
            >
              blinkord.com
            </a>{" "}
            and click on “Connect Discord.”
          </li>
          <li>
            <strong>2. </strong> Log in with your Discord account to fetch a
            list of servers you administer.
          </li>
          <li>
            <strong>3. </strong> Install the Blinkord bot on your selected
            server.
          </li>
          <li>
            <strong>4. </strong> Configure your Blink by setting up roles,
            pricing in SOL, and other details.
          </li>
          <li>
            <strong>5. </strong> Connect your Solana Wallet to receive payments.
          </li>
          <li>
            <strong>6. </strong> Generate and share your unique Blink link with
            your community.
          </li>
        </ol>
      </div>
    ),
  },
  {
    id: 5,
    question: "How do I purchase a premium role as a Discord member?",
    answer: (
      <div>
        <ol>
          <li>
            <strong>1. </strong> Click on the Blink link provided by the server
            owner or someone else.
          </li>
          <li>
            <strong>2. </strong> Authorize Blinkord to connect with Discord
            account for role assignment.
          </li>
          <li>
            <strong>3. </strong> Select the desired role and proceed to payment.
          </li>
          <li>
            <strong>4. </strong> Complete the payment using your Solana Wallet.
          </li>
          <li>
            <strong>5. </strong> The premium role is automatically assigned to
            your Discord account.
          </li>
        </ol>
      </div>
    ),
  },
  {
    id: 6,
    question: "Do I need a Solana Wallet to use Blinkord?",
    answer:
      (
        <div>
          <p>
            Yes, Blinkord requires the use of a Solana Wallet, such as Phantom, Solflare or others, for processing payments in SOL. The Phantom and Solflare Wallets are secure and user-friendly Solana wallets that facilitate quick transactions. You can download them as a browser extension or mobile app.
          </p>
          <p>
            Alternatively, if you prefer to use the in-app wallet on Discord, you are able to create a new wallet using the Blinkord Bot. The bot is going to generate a wallet for you and after depositing funds to that wallet, you can start using it to interact with the blink actions.
          </p>
        </div>
      ),
  },
  {
    id: 7,
    question: "Is Blinkord secure and safe to use?",
    answer: (
      <div>
        <p>Absolutely. Blinkord prioritizes security in several ways:</p>
        <br />
        <ul>
          <li>
            <strong>
              <a
                className="text-blue-700 cursor-pointer"
                href="https://discord.com/developers/docs/topics/oauth2"
                target="_blank"
              >
                Discord OAuth
              </a>{" "}
              Authentication:
            </strong>{" "}
            Uses secure authentication protocols, ensuring that your Discord
            credentials remain protected.
          </li>
          <li>
            <strong>Blockchain Transactions:</strong> All payments are processed
            on the Solana blockchain, known for its high security and speed.
          </li>
          <li>
            <strong>Privacy Protection:</strong> Blinkord does not require
            personal information, enhancing your privacy. It never asks for your
            wallet's private key, seed phrase, or direct access to your Discord
            account.
          </li>
          <li>
            <strong>Blinkord Bot Security:</strong> The bot requires minimal
            permissions and does not have access to personal messages or server
            administration.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 8,
    question: "How to use Blinkord within Discord?",
    answer: (
      <div>
        <p>
          Instead of using the platform, you can directly interact with blinks on Discord with the help of the Blinkord Bot. The bot recognizes Solana action URLs, unfurls the links and displays all the actions as clickable buttons. You can learn more about the bot{" "}
          <a className="text-blue-700 cursor-pointer" href="https://docs.blinkord.com/blinkord-bot" target="_blank">
            here
          </a>.
          and add it to your server{" "}
          <a className="text-blue-700 cursor-pointer" href="https://discord.com/oauth2/authorize?client_id=1277276051592052787&permissions=268443649&integration_type=0&scope=bot+applications.commands" target="_blank">
            by using this link
          </a>.
        </p>
      </div>
    ),
  },
  {
    id: 9,
    question:
      "Are there any fees associated with purchasing roles on Blinkord?",
    answer:
      "While Blinkord does not charge users any fees for purchasing roles, standard Solana network transaction fees (usually minimal) apply when making payments. These fees are paid to the network validators to process your transaction.",
  },
  {
    id: 10,
    question: "Is Blinkord Free?",
    answer: (
      <div>
        <p>
          Yes, Blinkord is 100% free for both users and server owners to use the
          platform.
        </p>
        <br />
        <p>
          However, Blinkord takes a{" "}
          <strong>2% fee from payouts to server owners</strong> when a role is
          purchased through a Blink. This fee helps support the platform's
          development and maintenance. In the future, there may be a paid plan
          available where Blinkord will not take any fees from server owners.
        </p>
      </div>
    ),
  },
  {
    id: 11,
    question: "How does Blinkord handle role expiration and management?",
    answer: (
      <div>
        <p>
          Server owners can set roles with <strong>expiration dates</strong>.
          Blinkord automatically:
        </p>
        <br />
        <ul>
          <li>
            <strong>Removes expired roles</strong> from members.
          </li>
          <li>
            <strong>Sends notifications</strong> to users via Discord direct
            messages about their role's expiration.
          </li>
        </ul>
        <br />
        <p>
          This feature ensures dynamic role management and encourages members to
          renew their access.
        </p>
      </div>
    ),
  },
  {
    id: 12,
    question: "What is the Blinkord Marketplace?",
    answer: (
      <div>
        <p>
          The{" "}
          <a
            className="text-blue-700 cursor-pointer"
            href="https://discord.com/developers/docs/topics/oauth2"
            target="_blank"
          >
            Blinkord Marketplace
          </a>{" "}
          is a hub where users can discover and interact with all Discord
          servers utilizing Blinkord. It allows members to find and purchase
          premium roles across multiple servers efficiently, expanding their
          Discord community engagement.
        </p>
        <br />
        <p>
          On the other hand, it helps Discord servers reach more users and
          expand the audience through the Blinks.
        </p>
      </div>
    ),
  },
];

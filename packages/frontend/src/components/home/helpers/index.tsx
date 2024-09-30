import {
  ArrowLeftRight,
  BadgeDollarSign,
  ChartCandlestick,
  Podcast,
  SquareUser,
  Target,
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
    title: "Elevated User Satisfaction",
    description:
      "By offering premium roles through Blinkord, you provide added value that keeps members engaged and satisfied, fostering loyalty and long-term retention.",
    icon: <Target />,
  },
  {
    id: 2,
    title: "Higher Conversion Rates",
    description:
      "Turn interest into commitment. Blinkord's frictionless payment and role assignment process reduces barriers, making it more likely for visitors to become paying members.",
    icon: <ArrowLeftRight />,
  },
  {
    id: 3,
    title: "Flexible Premium Subscriptions",
    description:
      "Offer ongoing value with ease. Set up flexible subscriptions for premium content, ensuring a steady revenue stream while giving members continuous access to exclusive features.",
    icon: <Podcast />,
  },
  {
    id: 4,
    title: "Secure and Instant Transactions",
    description:
      "Trust in every transaction. Blinkord leverages the Solana blockchain for fast, secure payments using SOL. Members can confidently make purchases, knowing their transactions are protected by robust blockchain technology.",
    icon: <BadgeDollarSign />,
  },
  {
    id: 5,
    title: "Blinkord Marketplace",
    description:
      "Get discovered by a wider audience. List your server on the Blinkord Marketplace to attract new members seeking premium Discord experiences. Tap into a growing network of users eager to find communities like yours.",
    icon: <ChartCandlestick />,
  },
];

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DISCORD_API_BASE_URL =
  process.env.NEXT_PUBLIC_DISCORD_API_BASE_URL ||
  "https://blinkord.onrender.com";

/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// ========================================

declare type DiscordRole = {
  id: string;
  name: string;
  amount: string; // Assuming it's a string representing a numeric value
};

declare type DiscordServer = {
  id: string;
  name: string;
  icon: string;
  customIcon?: string; // Optional custom icon for the blink
  description: string;
  detailedDescription: string; // Long message about the server and roles
  roles: DiscordRole[];
  ownerWallet: string; // Phantom wallet address of the server owner
};

declare type BlinkordServerSettings = {
  guildId: string;
  customTitle?: string;
  customIcon?: string;
  description: string;
  detailedDescription: string;
  selectedRoles: string[]; // Array of role IDs selected for the blink
  ownerWallet: string;
};

declare type DiscordOAuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

declare type ServerListResponse = {
  servers: {
    id: string;
    name: string;
    icon: string;
  }[];
};

declare type BlinkData = {
  guildId: string;
  title: string;
  icon: string;
  description: string;
  detailedDescription: string;
  roles: DiscordRole[];
};

declare type TransactionDetails = {
  roleId: string;
  amount: number;
  buyerWallet: string;
  sellerWallet: string;
};

declare type BlinkordApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// API request and response types
declare type CreateBlinkRequest = BlinkordServerSettings;

declare type CreateBlinkResponse = BlinkordApiResponse<{
  blinkUrl: string;
}>;

declare type GetBlinkDataRequest = {
  guildId: string;
  code: string; // Discord OAuth code
};

declare type GetBlinkDataResponse = BlinkordApiResponse<BlinkData>;

declare type ProcessTransactionRequest = TransactionDetails;

declare type ProcessTransactionResponse = BlinkordApiResponse<{
  success: boolean;
  roleAssigned: boolean;
}>;

// User types
declare type ServerOwner = SupabaseUser & {
  ownedServers: string[]; // Array of guild IDs
};

declare type DiscordMember = SupabaseUser & {
  discordId: string;
  joinedServers: string[]; // Array of guild IDs
};

// ========================================

declare type SupabaseUser = Database["public"]["Tables"]["users"]["Row"];

// Defining a generic response type for Supabase
declare type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};

// ======================================== UI types

declare type ServerFormData = {
  title: string;
  description: string;
  details: string;
  roles: string[];
};

export interface BlinkAction {
  title: string;
  description: string;
  fields: string[];
}

export interface BlinkProps {
  action: BlinkAction;
  websiteText: string;
}

// API Function Types

declare type GetDiscordLoginUrl = (owner: boolean) => Promise<string>;

declare type HandleDiscordCallback = (code: string) => Promise<{
  userId: string;
  username: string;
  guilds: DiscordServer[];
  token: string;
}>;

declare type GetGuildRoles = (
  guildId: string,
  token: string
) => Promise<{ blinkRolePosition: number; roles: DiscordRole[] }>;

declare type CreateOrEditGuild = (
  guildData: BlinkordServerSettings,
  address: string,
  message: string,
  signature: string,
  token: string
) => Promise<DiscordServer>;

declare type PatchGuild = (
  guildId: string,
  guildData: BlinkordServerSettings,
  address: string,
  message: string,
  signature: string,
  token: string
) => Promise<DiscordServer>;

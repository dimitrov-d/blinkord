import { create } from 'zustand';

interface UserState {
  token: string | null;
  userData: any;
  discordConnected: boolean;
  discordDisconnected: boolean;
  setToken: (token: string) => void;
  setUserData: (userData: any) => void;
  setDiscordConnected: (connected: boolean) => void;
  setDiscordDisconnected: (disconnected: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  token: null,
  userData: null,
  discordConnected: false,
  discordDisconnected: false,
  setToken: (token) => set({ token }),
  setUserData: (userData) => set({ userData }),
  setDiscordConnected: (connected) => set({ discordConnected: connected }),
  setDiscordDisconnected: (disconnected) => set({ discordDisconnected: disconnected }),
}));

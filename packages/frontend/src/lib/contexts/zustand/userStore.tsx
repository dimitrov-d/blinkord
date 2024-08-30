import { create } from "zustand";

interface UserState {
  token: string | null;
  userData: any;
  discordConnected: boolean;
  discordDisconnected: boolean;
  discordClientId: number;
  selectedGuildName: string | null;
  selectedGuildImage: string | null;
  selectedGuildId: string | null;
  setToken: (token: string) => void;
  setUserData: (userData: any) => void;
  setDiscordConnected: (connected: boolean) => void;
  setDiscordDisconnected: (disconnected: boolean) => void;
  setSelectedGuild: (
    id: string | null,
    name: string | null,
    image: string | null
  ) => void;
}

export const useUserStore = create<UserState>((set) => ({
  token: null,
  userData: null,
  discordConnected: false,
  discordDisconnected: false,
  discordClientId: 1277276051592052787,
  selectedGuildName: null,
  selectedGuildImage: null,
  selectedGuildId: null,
  setToken: (token) => set({ token, discordConnected: !!token }),
  setUserData: (userData) => set({ userData }),
  setDiscordConnected: (connected) => set({ discordConnected: connected }),
  setDiscordDisconnected: (disconnected) =>
    set({ discordDisconnected: disconnected }),
  setSelectedGuild: (id, name, image) =>
    set({
      selectedGuildId: id,
      selectedGuildName: name,
      selectedGuildImage: image,
    }),
}));
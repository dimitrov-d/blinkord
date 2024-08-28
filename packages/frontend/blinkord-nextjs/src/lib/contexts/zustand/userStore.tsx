import { create } from 'zustand';

interface UserState {
  token: string | null;
  userData: any;
  setToken: (token: string) => void;
  setUserData: (userData: any) => void;
}

export const useUserStore = create<UserState>((set) => ({
  token: null,
  userData: null,
  setToken: (token) => set({ token }),
  setUserData: (userData) => set({ userData }),
}));

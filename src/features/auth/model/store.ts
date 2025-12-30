import { create } from "zustand";

export type User = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  roles?: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isBootstrapped: boolean;
  setSession: (u: User | null, token: string | null) => void;
  clearSession: () => void;
  setBootstrapped: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isBootstrapped: false,
  setSession: (user, accessToken) => set({ user, accessToken }),
  clearSession: () => set({ user: null, accessToken: null }),
  setBootstrapped: (v) => set({ isBootstrapped: v }),
}));

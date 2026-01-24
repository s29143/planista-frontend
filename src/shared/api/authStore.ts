import { create } from "zustand";
import type { User } from "../types/user";

type AuthState = {
  user: User | null;
  isBootstrapped: boolean;
  setSession: (u: User | null) => void;
  clearSession: () => void;
  setBootstrapped: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isBootstrapped: false,
  setSession: (user) => set({ user }),
  clearSession: () => set({ user: null }),
  setBootstrapped: (v) => set({ isBootstrapped: v }),
}));

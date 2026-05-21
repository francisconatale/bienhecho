import { create } from "zustand";

export interface UserProfile {
  name: string;
  tradeId: string | null;
}

interface UserState {
  user: UserProfile | null;
  isRegistered: boolean;
  setUser: (user: UserProfile) => void;
  logout: () => void;
}

// Simple manual persistence
const getStoredUser = (): UserProfile | null => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("presupuestito-user");
  return stored ? JSON.parse(stored) : null;
};

export const useUserStore = create<UserState>((set) => ({
  user: getStoredUser(),
  isRegistered: !!getStoredUser(),
  setUser: (user) => {
    localStorage.setItem("presupuestito-user", JSON.stringify(user));
    set({ user, isRegistered: true });
  },
  logout: () => {
    localStorage.removeItem("presupuestito-user");
    set({ user: null, isRegistered: false });
  },
}));

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/user";
import { disconnectSocket } from "../services/socket.service";

interface AuthState {
  user: User | null;
  token: string | null;

  setUser: (user: User) => void;
  updateUser: (partial: Partial<User>) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setUser: (user) => {
        set({ user });
      },

      updateUser: (partial) => {
        const current = get().user;
        if (!current) return;

        const updated = { ...current, ...partial };
        set({ user: updated });
      },

      setToken: (token) => {
        set({ token });
      },

      logout: () => {
        disconnectSocket();
        set({ user: null, token: null });
        localStorage.removeItem("token");
        window.location.href = "/login";
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/user";

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

      // установить юзера (после логина/регистрации)
      setUser: (user) => {
        set({ user });
      },

      // обновить часть данных пользователя (для Edit Profile)
      updateUser: (partial) => {
        const current = get().user;
        if (!current) return;

        const updated = { ...current, ...partial };
        set({ user: updated });
      },

      // установить токен
      setToken: (token) => {
        set({ token });
      },

      // разлогин
      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem("token");
        window.location.href = "/login";
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

import { create } from "zustand";
import type { ILang } from "../types/lang";
import type { Post } from "../types/post";

type Theme = "light" | "dark";

type AuthView =
  | "login"
  | "signup"
  | "forgot-password"
  | "verify-otp"
  | "reset-password";

type PostModalState = {
  isOpen: boolean;
  post: Post | null;
};
interface AppState {
  resetToken: string;
  setResetToken: (email: string) => void;
  resetEmail: string;
  setResetEmail: (email: string) => void;
  authView: AuthView;
  setAuthView: (view: AuthView) => void;
  selectedLanguage: ILang | null;
  setSelectedLanguage: (arg: ILang) => void;
  isOpenPostModal: boolean;
  setIsOpenPostModal: (arg: boolean) => void;
  activeTab: number;
  setActiveTab: (tab: number) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  postModal: PostModalState;

  openCreatePostModal: () => void;
  openEditPostModal: (post: Post) => void;
  closePostModal: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  resetToken: "",
  setResetToken: (email: string) => set({ resetToken: email }),
  resetEmail: "",
  setResetEmail: (email: string) => set({ resetEmail: email }),
  authView: "login",
  setAuthView: (view: AuthView) => set({ authView: view }),
  selectedLanguage: null,
  setSelectedLanguage: (value: ILang) => set({ selectedLanguage: value }),
  isOpenPostModal: false,
  setIsOpenPostModal: (arg: boolean) => set({ isOpenPostModal: arg }),
  activeTab: 0,
  setActiveTab: (tab) => {
    localStorage.setItem("activeTab", String(tab));
    set({ activeTab: tab });
  },

  theme: (localStorage.getItem("theme") as Theme) || "light",
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");

    set({ theme });
  },

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);

      document.documentElement.classList.toggle("dark", newTheme === "dark");

      return { theme: newTheme };
    });
  },

  postModal: {
    isOpen: false,
    post: null,
  },

  openCreatePostModal: () =>
    set({
      postModal: {
        isOpen: true,
        post: null,
      },
    }),

  openEditPostModal: (post) =>
    set({
      postModal: {
        isOpen: true,
        post,
      },
    }),

  closePostModal: () =>
    set({
      postModal: {
        isOpen: false,
        post: null,
      },
    }),
}));

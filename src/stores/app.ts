import { create } from "zustand";
import type { ILang } from "../types/lang";
import type { Post } from "../types/post";
import type { IMessage } from "../types/chats";

type Theme = "light" | "dark";

type AuthView =
  | "login"
  | "signup"
  | "forgot-password"
  | "verify-otp"
  | "reset-password";

export type PostsMode = "all" | "saved" | "user";

type PostModalState = {
  isOpen: boolean;
  post: Post | null;
  mode: PostsMode;
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

  isOpenMessageToast: boolean;
  setIsOpenMessageToast: (arg: boolean) => void;

  activeTab: number;
  setActiveTab: (tab: number) => void;

  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  postModal: PostModalState;

  openCreatePostModal: (mode: PostsMode) => void;
  openEditPostModal: (post: Post, mode: PostsMode) => void;
  closePostModal: () => void;

  toastMessage: IMessage | null;
  setToast: (message: IMessage) => void;
}

export const useAppStore = create<AppState>((set) => ({
  resetToken: "",
  setResetToken: (email) => set({ resetToken: email }),

  resetEmail: "",
  setResetEmail: (email) => set({ resetEmail: email }),

  authView: "login",
  setAuthView: (view) => set({ authView: view }),

  selectedLanguage: null,
  setSelectedLanguage: (value) => set({ selectedLanguage: value }),

  isOpenPostModal: false,
  setIsOpenPostModal: (arg) => set({ isOpenPostModal: arg }),

  isOpenMessageToast: false,
  setIsOpenMessageToast: (arg: boolean) => set({ isOpenMessageToast: arg }),

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

      return {
        theme: newTheme,
      };
    });
  },
  toastMessage: null,
  setToast: (message: IMessage) => set({ toastMessage: message }),

  postModal: {
    isOpen: false,
    post: null,
    mode: "all",
  },

  openCreatePostModal: (mode) =>
    set({
      postModal: {
        isOpen: true,
        post: null,
        mode,
      },
    }),

  openEditPostModal: (post, mode) =>
    set({
      postModal: {
        isOpen: true,
        post,
        mode,
      },
    }),

  closePostModal: () =>
    set((state) => ({
      postModal: {
        isOpen: false,
        post: null,
        mode: state.postModal.mode,
      },
    })),
}));

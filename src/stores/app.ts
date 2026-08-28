import { create } from "zustand";
import type { ILang } from "../types/lang";
import type { Post } from "../types/post";
import type { Chat, IMessage } from "../types/chats";
import type { AchievementKey } from "../types/achievements";

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

  chats: Chat[];
  setChats: (chats: Chat[]) => void;

  achievementUnlockQueue: AchievementKey[];
  enqueueAchievementUnlocks: (keys: AchievementKey[]) => void;
  dismissAchievementUnlock: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
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

  chats: [],
  setChats: (chats: Chat[]) => set({ chats }),

  theme: (localStorage.getItem("theme") as Theme) || "light",
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");

    set({ theme });
  },

  toggleTheme: () => {
    const applyTheme = () => {
      const newTheme = get().theme === "light" ? "dark" : "light";

      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      set({ theme: newTheme });
    };

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const supportsViewTransition =
      typeof document.startViewTransition === "function";

    if (!supportsViewTransition || prefersReducedMotion) {
      applyTheme();
      return;
    }

    // Soft feather is the outer ~45% of the mask — size past the corner hypot.
    const radius = Math.hypot(window.innerWidth / 2, window.innerHeight / 2);
    const size = Math.ceil((radius / 0.55) * 2);

    let style = document.getElementById("theme-circle-keyframes");
    if (!style) {
      style = document.createElement("style");
      style.id = "theme-circle-keyframes";
      document.head.appendChild(style);
    }
    style.textContent = `
      @keyframes theme-circle-expand {
        from {
          mask-size: 0px 0px;
          -webkit-mask-size: 0px 0px;
        }
        to {
          mask-size: ${size}px ${size}px;
          -webkit-mask-size: ${size}px ${size}px;
        }
      }
    `;

    document.startViewTransition(applyTheme);
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

  achievementUnlockQueue: [],
  enqueueAchievementUnlocks: (keys) =>
    set((state) => {
      const seen = new Set(state.achievementUnlockQueue);
      const next: AchievementKey[] = [];

      for (const key of keys) {
        if (seen.has(key)) continue;

        seen.add(key);
        next.push(key);
      }

      if (!next.length) {
        return state;
      }

      return {
        achievementUnlockQueue: [...state.achievementUnlockQueue, ...next],
      };
    }),
  dismissAchievementUnlock: () =>
    set((state) => ({
      achievementUnlockQueue: state.achievementUnlockQueue.slice(1),
    })),
}));

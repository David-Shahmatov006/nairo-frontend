import { create } from "zustand";
import type { ILang } from "../types/lang";

interface AppState {
  selectedLanguage: ILang | null;
  setSelectedLanguage: (arg: ILang) => void;
  isOpenPostModal: boolean;
  setIsOpenPostModal: (arg: boolean) => void;
  shareOpen: boolean;
  setShareOpen: (arg: boolean) => void;
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedLanguage: null,
  setSelectedLanguage: (value: ILang) => set({ selectedLanguage: value }),
  isOpenPostModal: false,
  setIsOpenPostModal: (arg: boolean) => set({ isOpenPostModal: arg }),
  shareOpen: false,
  setShareOpen: (arg: boolean) => set({ shareOpen: arg }),
  activeTab: 0,
  setActiveTab: (tab) => {
    localStorage.setItem("activeTab", String(tab));
    set({ activeTab: tab });
  },
}));

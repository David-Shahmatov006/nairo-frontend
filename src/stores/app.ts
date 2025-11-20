import { create } from "zustand";
import type { ILang } from "../types/lang";

interface AppState {
  selectedLanguage: ILang | null;
  setSelectedLanguage: (arg: ILang) => void;
  isOpenPostModal: boolean;
  setIsOpenPostModal: (arg: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedLanguage: null,
  setSelectedLanguage: (value: ILang) => set({ selectedLanguage: value }),
  isOpenPostModal: false,
  setIsOpenPostModal: (arg: boolean) => set({ isOpenPostModal: arg }),
}));

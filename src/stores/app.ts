import { create } from "zustand";
import type { ILang } from "../types/lang";

interface AppState {
  selectedLanguage: ILang | null;
  setSelectedLanguage: (arg: ILang) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedLanguage: null,
  setSelectedLanguage: (value: ILang) => set({ selectedLanguage: value }),
}));

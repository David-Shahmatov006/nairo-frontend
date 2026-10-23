import { create } from "zustand";

const STORAGE_KEY = "nairo:christmas-music";

const savedPreference = () => {
  try { return localStorage.getItem(STORAGE_KEY) === "on"; }
  catch { return false; }
};

export const useChristmasMusicStore = create<{
  enabled: boolean;
  playing: boolean;
  recording: boolean;
  failed: boolean;
  setEnabled: (enabled: boolean) => void;
}>((set) => ({
  enabled: savedPreference(),
  playing: false,
  recording: false,
  failed: false,
  setEnabled: (enabled) => {
    try { localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off"); }
    catch { /* Music can still be used when storage is unavailable. */ }
    set({ enabled, failed: false });
  },
}));

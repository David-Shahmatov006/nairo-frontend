export type SeasonalThemeId = "off" | "valentine" | "halloween" | "christmas";

/**
 * Change this value to switch the entire app; no UI setting is needed.
 * "off"       — original Nairo
 * "halloween" — existing mascots in costume, occasional bats & a corner web
 * "christmas" — existing mascots in costume, banner lights & the original Snowfall
 * "valentine" — Valentine's costumes for the existing mascots
 * Holidays keep the normal light/dark colors and respect reduced motion.
 */
export const SEASONAL_THEME: SeasonalThemeId = "halloween";

export const isSeasonalActive = (id: SeasonalThemeId = SEASONAL_THEME) =>
  id !== "off";

export const applySeasonalThemeToDocument = (
  id: SeasonalThemeId = SEASONAL_THEME,
) => {
  const root = document.documentElement;

  if (id === "off") {
    delete root.dataset.seasonal;
    return;
  }

  root.dataset.seasonal = id;
};

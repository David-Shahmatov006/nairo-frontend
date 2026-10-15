import { applySeasonalThemeToDocument, isSeasonalActive, SEASONAL_THEME } from "./seasonalTheme";
import type { SeasonalThemeId } from "./seasonalTheme";

describe("seasonalTheme", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("data-seasonal");
    document.documentElement.classList.remove("dark");
  });

  it("uses the configured theme by default", () => {
    applySeasonalThemeToDocument();
    expect(document.documentElement.dataset.seasonal).toBe(
      SEASONAL_THEME === "off" ? undefined : SEASONAL_THEME,
    );
    expect(isSeasonalActive()).toBe(SEASONAL_THEME !== "off");
  });

  it("treats off as inactive", () => {
    expect(isSeasonalActive("off")).toBe(false);
  });

  it.each<SeasonalThemeId>(["valentine", "halloween", "christmas"])(
    "treats %s as active",
    (id) => {
      expect(isSeasonalActive(id)).toBe(true);
    },
  );

  it("switches holidays and restores the original app without changing dark mode", () => {
    document.documentElement.classList.add("dark");
    for (const theme of ["halloween", "christmas", "valentine"] as const) {
      applySeasonalThemeToDocument(theme);
      expect(document.documentElement.dataset.seasonal).toBe(theme);
    }
    applySeasonalThemeToDocument("off");
    expect(document.documentElement).not.toHaveAttribute("data-seasonal");
    expect(document.documentElement).toHaveClass("dark");
  });
});

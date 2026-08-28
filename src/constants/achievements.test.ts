import {
  ACHIEVEMENT_ICONS,
  mapAchievements,
  pickAchievementKeys,
} from "./achievements";
import { ACHIEVEMENT_KEYS } from "../types/achievements";

describe("ACHIEVEMENT_ICONS", () => {
  it("has an icon for every achievement key", () => {
    for (const key of ACHIEVEMENT_KEYS) {
      expect(ACHIEVEMENT_ICONS[key]).toBeTruthy();
    }
  });
});

describe("mapAchievements", () => {
  it("returns every known key in a stable order", () => {
    const result = mapAchievements([]);

    expect(result.map((item) => item.key)).toEqual([...ACHIEVEMENT_KEYS]);
  });

  it("defaults to locked when the API omits a key", () => {
    const result = mapAchievements([{ key: "veteran", unlocked: true }]);

    const veteran = result.find((item) => item.key === "veteran");
    const nightOwl = result.find((item) => item.key === "night_owl");

    expect(veteran?.unlocked).toBe(true);
    expect(nightOwl?.unlocked).toBe(false);
  });

  it("ignores keys the frontend does not know about", () => {
    const result = mapAchievements([
      { key: "not_a_real_achievement", unlocked: true },
    ]);

    expect(result).toHaveLength(ACHIEVEMENT_KEYS.length);
    expect(result.every((item) => item.unlocked === false)).toBe(true);
  });

  it("attaches an icon to each achievement", () => {
    const result = mapAchievements([]);

    expect(result.every((item) => Boolean(item.icon))).toBe(true);
  });

  it("keeps the last value when a key is duplicated", () => {
    const result = mapAchievements([
      { key: "polyglot", unlocked: true },
      { key: "polyglot", unlocked: false },
    ]);

    expect(result.find((item) => item.key === "polyglot")?.unlocked).toBe(false);
  });
});

describe("pickAchievementKeys", () => {
  it("returns an empty array for non-array input", () => {
    expect(pickAchievementKeys(undefined)).toEqual([]);
    expect(pickAchievementKeys(null)).toEqual([]);
    expect(pickAchievementKeys("night_owl")).toEqual([]);
    expect(pickAchievementKeys({ key: "night_owl" })).toEqual([]);
  });

  it("keeps only known achievement keys", () => {
    const result = pickAchievementKeys([
      "night_owl",
      "nope",
      "veteran",
      42,
      null,
      { key: "polyglot" },
    ]);

    expect(result).toEqual(["night_owl", "veteran"]);
  });

  it("preserves order and duplicates as sent by the API", () => {
    expect(pickAchievementKeys(["veteran", "night_owl", "veteran"])).toEqual([
      "veteran",
      "night_owl",
      "veteran",
    ]);
  });

  it("returns an empty array for an empty list", () => {
    expect(pickAchievementKeys([])).toEqual([]);
  });
});

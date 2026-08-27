import type { Achievement, AchievementKey } from "../types/achievements";
import { ACHIEVEMENT_KEYS } from "../types/achievements";
import nightOwl from "../assets/images/achievements/night_owl.webp";
import earlyBird from "../assets/images/achievements/early_bird.webp";
import polyglot from "../assets/images/achievements/polyglot.webp";
import valentine from "../assets/images/achievements/valentine.webp";
import veteran from "../assets/images/achievements/veteran.webp";
import christmasSpirit from "../assets/images/achievements/christmas_spirit.webp";
import halloween from "../assets/images/achievements/halloween.webp";

export const ACHIEVEMENT_ICONS: Record<AchievementKey, string> = {
  night_owl: nightOwl,
  early_bird: earlyBird,
  polyglot,
  valentine,
  veteran,
  christmas_spirit: christmasSpirit,
  halloween,
};

export const mapAchievements = (
  items: Array<{ key: string; unlocked: boolean }>,
): Achievement[] => {
  const unlockedByKey = new Map(
    items.map((item) => [item.key, item.unlocked]),
  );

  return ACHIEVEMENT_KEYS.map((key) => ({
    key,
    icon: ACHIEVEMENT_ICONS[key],
    unlocked: unlockedByKey.get(key) ?? false,
  }));
};

export const pickAchievementKeys = (keys: unknown): AchievementKey[] => {
  if (!Array.isArray(keys)) {
    return [];
  }

  return keys.filter(
    (key): key is AchievementKey =>
      typeof key === "string" && ACHIEVEMENT_KEYS.includes(key as AchievementKey),
  );
};

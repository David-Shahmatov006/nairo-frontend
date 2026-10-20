import i18n from "../i18n";
import { useAppStore } from "../stores/app";
import { useAuthStore } from "../stores/auth";
import { LANGS } from "../constants/langs";
import { userService } from "../services/user.service";
import { pickAchievementKeys } from "../constants/achievements";
import { mutate } from "swr";

export const executeAgentActions = async (actions: unknown) => {
  if (!Array.isArray(actions)) return;
  const store = useAppStore.getState();

  for (const action of actions) {
    if (!action || typeof action !== "object") continue;
    switch (action.type) {
      case "setTheme":
        if (action.value === "dark" || action.value === "light") {
          store.setTheme(action.value);
        }
        break;

      case "openCreatePost":
        store.openCreatePostModal("all");
        break;

      case "setLanguage": {
        const language = LANGS.find((lang) => lang.code === action.value);
        if (!language) break;
        const { user, updateUser } = useAuthStore.getState();
        if (user) {
          const data = await userService.changeLanguage(language.code);
          // A response for a previous account must not update the current one.
          if (useAuthStore.getState().user?.id !== user.id) break;
          updateUser({ preferredLanguage: language.code });
          store.enqueueAchievementUnlocks(pickAchievementKeys(data?.newlyUnlocked));
          void mutate(["achievements", user.id]);
        }
        localStorage.setItem("language", language.code);
        store.setSelectedLanguage(language);
        await i18n.changeLanguage(language.code);
        break;
      }
    }
  }
};

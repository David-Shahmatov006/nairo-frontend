export type AgentAction =
  | {
      type: "setLanguage";
      value:
        | "de"
        | "en"
        | "es"
        | "fr"
        | "it"
        | "ja"
        | "pl"
        | "pt"
        | "tr"
        | "uk";
    }
  | {
      type: "setTheme";
      value: "light" | "dark";
    }
  | {
      type: "openCreatePost";
    };

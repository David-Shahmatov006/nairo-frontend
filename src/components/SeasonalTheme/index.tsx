import { SEASONAL_THEME } from "../../constants/seasonalTheme";
import { Snowfall } from "../Snowfall";
import { HalloweenEffects } from "./HalloweenEffects";
import { ChristmasDecorations } from "./SeasonalDecorations";

export const SeasonalThemeRoot = () => {
  if (SEASONAL_THEME === "christmas") {
    return (
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden select-none" aria-hidden="true">
        <ChristmasDecorations />
        <div className="motion-reduce:hidden motion-reduce:[&_.snowflake]:animate-none"><Snowfall /></div>
      </div>
    );
  }

  if (SEASONAL_THEME === "halloween") {
    return <HalloweenEffects />;
  }

  return null;
};

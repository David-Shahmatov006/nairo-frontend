import { SEASONAL_THEME } from "../../constants/seasonalTheme";
import { Snowfall } from "../Snowfall";
import { HalloweenEffects } from "./HalloweenEffects";

export const SeasonalThemeRoot = () => {
  if (SEASONAL_THEME === "christmas") {
    return (
      <div className="seasonal-effects seasonal-snowfall" aria-hidden="true">
        <Snowfall />
      </div>
    );
  }

  if (SEASONAL_THEME === "halloween") {
    return <HalloweenEffects />;
  }

  return null;
};

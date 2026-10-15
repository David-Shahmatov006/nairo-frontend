import { SEASONAL_THEME } from "../../constants/seasonalTheme";
import welcome from "../../assets/images/happyMuskots.webp";
import surprised from "../../assets/images/surprisedMuskot.webp";
import shrug from "../../assets/images/surprisedMuskot2.webp";
import thinking from "../../assets/images/thinkingMuskot.webp";
import puzzled from "../../assets/images/thinkingMuskot2.webp";
import search from "../../assets/images/search_muskot.webp";
import christmas from "../../assets/images/seasonal-mascots/christmas.png";
import halloween from "../../assets/images/seasonal-mascots/halloween.png";
import valentine from "../../assets/images/seasonal-mascots/valentine.png";

const originals = { welcome, surprised, shrug, thinking, puzzled, search };
const atlases = { christmas, halloween, valentine };
// Generated sheets contain five groups with uneven spacing, not six equal cells.
// The two original surprised poses share the seasonal shrugging character.
const viewBoxes = {
  welcome: "0 0 585 512",
  surprised: "590 0 470 512",
  shrug: "590 0 470 512",
  thinking: "1080 0 456 535",
  puzzled: "60 512 490 512",
  search: "585 512 480 512",
};
export type MascotPose = keyof typeof originals;

/** Show one character group from the holiday sheet without separate downloads. */
export const SeasonalMascot = ({
  pose,
  className = "",
}: { pose: MascotPose; className?: string }) => {
  if (SEASONAL_THEME === "off") {
    return <img src={originals[pose]} alt="" className={className} />;
  }

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`seasonal-mascot ${className}`}
      data-mascot-pose={pose}
      viewBox={viewBoxes[pose]}
      overflow="hidden"
    >
      <image href={atlases[SEASONAL_THEME]} width="1536" height="1024" />
    </svg>
  );
};

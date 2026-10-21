import snowyTree from "../../assets/images/seasonal-mascots/christmas-tree-snow-3d.png";
import { SEASONAL_THEME } from "../../constants/seasonalTheme";

/** Page illustrations occupy a deliberate layout slot, never the viewport. */
export const ChristmasAccent = ({
  kind = "tree",
  className = "",
}: {
  kind?: "tree" | "bauble";
  className?: string;
}) => {
  if (SEASONAL_THEME !== "christmas") return null;

  return (
    <img
      src={kind === "tree" ? snowyTree : import.meta.env.BASE_URL + "images/seasonal-bauble-3d.png"}
      width={256}
      height={384}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`pointer-events-none block h-auto shrink-0 select-none object-contain ${className}`}
    />
  );
};

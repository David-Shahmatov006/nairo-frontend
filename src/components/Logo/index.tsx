import clsx from "clsx";
import logo from "../../../public/nairo_logo.webp";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes";

export const Logo = ({
  className,
  textClassName,
  iconClassName,
}: {
  className?: string;
  textClassName?: string;
  iconClassName?: string;
}) => {
  return (
    <Link to={ROUTES.HOME}>
      <div className={clsx("w-fit flex items-center gap-2", className)}>
        <img src={logo} className={clsx(iconClassName, "min-2000px:size-[2vw] size-8")} />
        <span
          className={clsx(
            "dark:text-[#f9f5e8] font-manrope font-[700] min-2000px:text-[1.7vw] text-[30px]",
            textClassName,
          )}
        >
          Nairo
        </span>
      </div>
    </Link>
  );
};

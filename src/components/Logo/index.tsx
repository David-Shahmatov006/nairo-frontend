import clsx from "clsx";
import logo from "../../../public/nairo_logo.webp";
import premiumLogo from "../../assets/images/nairoPremium.webp";

export const Logo = ({
  isPremium,
  className,
  iconClassName,
  textClassName,
}: {
  isPremium?: boolean;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}) => {
  return (
    <div className={clsx("w-fit flex items-center gap-2", className)}>
      <img
        src={isPremium ? premiumLogo : logo}
        className={clsx("w-[40px]", iconClassName)}
      />
      <span
        className={clsx("font-manrope font-[700] text-[30px]", textClassName)}
      >
        Nairo
      </span>
    </div>
  );
};

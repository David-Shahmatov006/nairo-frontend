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
        className={clsx(isPremium ? 'w-[38px] mt-1' : 'w-10', iconClassName)}
      />
      <span
        className={clsx("dark:text-[#f9f5e8] font-manrope font-[700] text-[30px]", textClassName)}
      >
        Nairo
      </span>
    </div>
  );
};

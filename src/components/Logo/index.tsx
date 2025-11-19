import logo from "../../../public/nairo_logo.webp";
import premiumLogo from "../../assets/images/nairoPremium.webp";

export const Logo = ({isPremium}: {isPremium?: boolean}) => {
  return (
    <div className="flex items-center gap-2 hover:opacity-70 duration-300 cursor-pointer">
      <img src={isPremium ? premiumLogo : logo} className="w-[40px]" />
      <span className="font-manrope font-[700] text-[30px]">Nairo</span>
    </div>
  );
};

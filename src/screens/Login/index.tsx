import { LoginBackground } from "../../assets/svgComponents/LoginBackground";
import { Logo } from "../../components/Logo";
import { LoginModal } from "./components/LoginModal";
import { LoginTabs } from "./components/LoginTabs";
import { SignUpModal } from "./components/SignUpModal";
import { useAppStore } from "../../stores/app";
import { OTPModal } from "./components/OTPModal";
import { NewPasswordModal } from "./components/NewPasswordModal";
import { LanguageSelector } from "../Main/tabs/Settings/components/LanguageSelector";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import clsx from "clsx";

export const Login = () => {
  const { authView } = useAppStore();
  const { t } = useTranslation();
  const isEnglishCurrentLanguage = i18n.language === "en";

  return (
    <>
      <div className="relative max-768px:max-w-full max-1024px:pt-[5%] min-2000px:max-w-[60vw] max-w-[70%] mx-auto h-screen flex max-1024px:flex-col items-center justify-between max-768px:pb-10">
        <div className="w-full max-1024px:block hidden mb-7">
          <LanguageSelector />
        </div>
        <LoginBackground className="max-1024px:fixed min-2000px:scale-[1.2] min-2800px:scale-[2] min-4000px:scale-[3] min-5000px:scale-[4] min-4000px:left-[15vw] absolute pointer-events-none" />
        <div className="flex max-1024px:w-[90%] min-2000px:w-[30vw] w-[50%] mb-[10%] flex-col max-1024px:items-center justify-center z-[2]">
          <Logo
            iconClassName="[@media(min-width:1024px)_and_(max-width:1440px)]:size-10 min-2000px:size-[3vw] size-[50px]"
            textClassName="[@media(min-width:1024px)_and_(max-width:1440px)]:text-[45px] min-2000px:text-[3vw] min-2000px:ml-[.5vw]"
          />
          <h2 className="max-768px:text-[15px] [@media(min-width:1024px)_and_(max-width:1440px)]:text-[18px] min-2000px:text-[1.1vw] text-[20px] font-[700] leading-[120%] dark:text-white/70 text-[#111827] min-2000px:mb-[.5vw] mb-[16px] max-1024px:mt-2">
            {t("auth.subtitle")}
          </h2>
          <p className="dark:text-white/50 text-[#3B4657] max-1024px:text-center max-768px:text-[14px] [@media(min-width:1024px)_and_(max-width:1440px)]:text-[15px] min-2000px:text-[.9vw] text-[16px] font-[500] leading-[150%]">
            {t("auth.description")}
          </p>
        </div>
        <div className="relative max-500px:!w-[93%] max-1024px:w-[70%] min-2000px:w-[23vw] w-[45%] flex flex-col items-center justify-between max-768px:!justify-center max-1024px:pb-10">
          <div
            className={clsx(
              "max-1024px:relative max-1024px:right-0 fixed top-[3%]",
              isEnglishCurrentLanguage && "right-[25%] min-2000px:right-[28%]",
            )}
          >
            <LoginTabs />
          </div>
          {authView === "login" ? (
            <LoginModal />
          ) : authView === "signup" ? (
            <SignUpModal />
          ) : authView === "forgot-password" ? (
            <OTPModal />
          ) : (
            <NewPasswordModal />
          )}
        </div>
      </div>
      <div className="max-1024px:hidden absolute right-[3%] top-[3%]">
        <LanguageSelector />
      </div>
    </>
  );
};

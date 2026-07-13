import { useTranslation } from "react-i18next";
import { useAppStore } from "../../../../stores/app";

export const LoginTabs = () => {
  const { authView, setAuthView } = useAppStore();
  const { t } = useTranslation();

  return (
    <div className="flex items-center dark:bg-[#272727] bg-[#F3F4F6] min-2000px:p-[.1vw] p-[4px] border dark:border-white/20 border-[#E5E7EB] min-2000px:rounded-[.4vw] rounded-[12px] min-2000px:h-[2vw] h-[41px] min-2000px:mb-[1vw] mb-[48px]">
      <button
        onClick={() => setAuthView("signup")}
        className={`dark:text-white/80 text-black min-2000px:h-[1.6vw] h-[33px] min-2000px:px-[.5vw] px-4 min-2000px:rounded-[.3vw] rounded-[12px] min-2000px:text-[.8vw] text-[14px] font-[400] transition-colors cursor-pointer ${
          authView === "signup"
            ? "dark:bg-white/20 bg-white shadow-sm"
            : "dark:hover:text-white/50 hover:text-gray-700"
        }`}
      >
        {t('auth.sign_up')}
      </button>

      <button
        onClick={() => setAuthView("login")}
        className={`dark:text-white/80 text-black min-2000px:h-[1.6vw] h-[33px] min-2000px:px-[.5vw] px-4 min-2000px:rounded-[.3vw] rounded-[12px] min-2000px:text-[.8vw] text-[14px] font-[400] transition-colors cursor-pointer ${
          authView !== "signup"
            ? "dark:bg-white/20 bg-white shadow-sm"
            : "dark:hover:text-white/50 hover:text-gray-700 hover:text-gray-700"
        }`}
      >
        {t('auth.login_text')}
      </button>
    </div>
  );
};

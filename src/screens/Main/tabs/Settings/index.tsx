import { useTranslation } from "react-i18next";
import { ChangeEmail } from "./components/ChangeEmail";
import { ChangePassword } from "./components/ChangePassword";
import { LanguageSelector } from "./components/LanguageSelector";
import { motion } from "framer-motion"
import { useAuthStore } from "../../../../stores/auth";

export const Settings = () => {
  const { t } = useTranslation();
  const { logout } = useAuthStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="justify-between flex max-768px:flex-col-reverse items-start max-1024px:ml-0 ml-[10%] [@media(min-width:1024px)_and_(max-width:1440px)]:mr-10 font-manrope"
    >
      <div className="max-768px:w-full w-[60%] max-768px:mt-5">
        <ChangeEmail />
        <ChangePassword />
        <button onClick={logout} className="min-2000px:mt-[1vw] mt-10 dark:bg-black bg-white dark:text-white/80 text-[#111827] w-full min-2000px:px-[.4vw] px-4 min-2000px:h-[1.7vw] h-[50px] font-[500] rounded-[15px] border dark:border-white/10 border-gray-300 hover:ring-2 hover:ring-[red]/40 duration-300 cursor-pointer min-2000px:text-[.8vw]">
          {t("settings.logout")}
        </button>
      </div>
      <LanguageSelector />
    </motion.div>
  );
};

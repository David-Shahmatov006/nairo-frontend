import { useTranslation } from "react-i18next";
import { ChangeEmail } from "./components/ChangeEmail";
import { ChangePassword } from "./components/ChangePassword";
import { LanguageSelector } from "./components/LanguageSelector";
import { motion } from "framer-motion"

export const Settings = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="justify-between flex ml-[10%] font-manrope"
    >
      <div className="w-[60%]">
        <ChangeEmail />
        <ChangePassword />
        <button className="mt-10 bg-white text-[#111827] w-full px-4 h-[50px] font-[500] rounded-[15px] border border-gray-300 hover:ring-2 hover:ring-[red]/40 duration-300 cursor-pointer">
          {t("settings.logout")}
        </button>
      </div>
      <LanguageSelector />
    </motion.div>
  );
};

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import icon from "../.././assets/images/404.webp";
import { useTranslation } from "react-i18next";

export const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="fixed z-[999] h-screen w-screen flex flex-col items-center justify-center gap-6">
      <motion.img
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        src={icon}
        className="w-[300px]"
      />

      <p className="text-gray-500 text-xl">{t("not_found.subtitle")}</p>

      <Link
        to="/"
        className="flex items-center justify-center cursor-pointer font-bold rounded-lg duration-300 py-3 px-6 text-base h-[48px] gap-[12px] dark:bg-black/50 dark:border border-white/10 bg-gray-900 text-white hover:ring-2 active:bg-gray-700 focus:ring-2 ring-main/70"
      >
        {t("not_found.button_text")}
      </Link>
    </div>
  );
};

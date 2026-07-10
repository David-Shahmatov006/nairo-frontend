import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Posts } from "../Home/components/Posts";

export const Saved = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="font-manrope max-768px:p-0 p-6 flex flex-col max-768px:gap-1 min-2000px:gap-[.5vw] gap-4"
    >
      <h1 className="dark:text-white/80 min-2000px:text-[1.2vw] text-[20px] font-[600]">
        {t("saved.title")}
      </h1>
      <p className="text-gray-500 min-2000px:text-[.8vw] text-sm max-768px:mb-7 mb-4">
        {t("saved.subtitle")}
      </p>

      <div className="flex flex-col gap-4">
        <Posts mode="saved" />
      </div>
    </motion.div>
  );
};

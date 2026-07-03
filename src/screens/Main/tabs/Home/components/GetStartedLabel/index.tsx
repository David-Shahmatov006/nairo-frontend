import { useState } from "react";
import { GetStartedEllipse } from "../../../../../../assets/svgComponents/GetStartedEllipse";
import muskots from '../../../../../../assets/images/happyMuskots.webp'
import { TfiClose } from "react-icons/tfi";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const GetStartedLabel = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="welcomeBanner"
          initial={{ opacity: 0, y: "-10%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.5 }}
          className="relative rounded-lg shadow-sm dark:bg-black dark:text-[#f9f5e8] bg-white overflow-hidden w-full flex items-center justify-between max-768px:p-4 p-8"
        >
           <img
            src={muskots}
            className="max-768px:hidden rotate-[-0deg] z-[1] w-[280px] absolute right-[3%] -bottom-[15%] opacity-95"
          />
          <GetStartedEllipse className="absolute inset-0 h-full" />
          <div className="z-[2]">
            <h1 className="max-768px:text-[16px] text-[20px] font-manrope font-[700] mb-5">
              {t("home.welcome_to_nairo")}
            </h1>
            <h2 className="max-768px:text-[14px] relative z-[2] max-w-[68%] font-manrope font-[600] mb-7">
               {t("home.banner_description")}
            </h2>
            <p className="text-[20px] font-manrope font-[700]">
               {t("home.banner_your_journey")}
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="z-[2] absolute dark:bg-[#191a1a] bg-[#FFFFFF] border flex items-center justify-center dark:border-white/20 border-[#E5E7EB] rounded-[12px] max-768px:size-8 size-10 max-768px:top-4 top-[32px] max-768px:right-4 right-[32px] cursor-pointer hover:ring-2 hover:ring-main/50  duration-300"
          >
            <TfiClose className="max-768px:text-[14px]" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

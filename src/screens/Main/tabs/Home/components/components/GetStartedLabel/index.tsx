import { useState } from "react";
import nairoCoins from "../../../../../../../assets/images/nairoCoins.webp";
import { GetStartedEllipse } from "../../../../../../../assets/svgComponents/GetStartedEllipse";
import { TfiClose } from "react-icons/tfi";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const GetStartedLabel = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="welcomeBanner"
          initial={{ opacity: 0, y: "-10%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-10%" }}
          transition={{ duration: 0.5 }}
          className="relative rounded-lg shadow-sm bg-white overflow-hidden w-full flex items-center justify-between p-8"
        >
          <img
            src={nairoCoins}
            className="rotate-[-20deg] z-[1] w-[320px] absolute -right-[1%] -bottom-[25%] opacity-95"
          />
          <GetStartedEllipse className="absolute inset-0 h-full" />
          <div className="z-[2]">
            <h1 className="text-[20px] font-manrope font-[700] mb-5">
              {t("home.welcome_to_nairo")}
            </h1>
            <h2 className="relative z-[2] max-w-[68%] font-manrope font-[600] mb-7">
               {t("home.banner_description")}
            </h2>
            <p className="text-[20px] font-manrope font-[700]">
               {t("home.banner_your_journey")}
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="z-[2] absolute w-[40px] bg-[#FFFFFF] shadow-shadow-xs border flex items-center justify-center border-[#E5E7EB] rounded-[12px] h-[40px] top-[32px] right-[32px] cursor-pointer hover:ring-2 hover:ring-gray-300/50 duration-300"
          >
            <TfiClose />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

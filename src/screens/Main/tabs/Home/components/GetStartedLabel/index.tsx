import { useState } from "react";
import { GetStartedEllipse } from "../../../../../../assets/svgComponents/GetStartedEllipse";
import muskots from "../../../../../../assets/images/happyMuskots.webp";
import { TfiClose } from "react-icons/tfi";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const GetStartedLabel = () => {
  const { t } = useTranslation();
  const [isClosed, setIsClosed] = useState(() =>
    JSON.parse(localStorage.getItem("isClosedBanner") ?? "false"),
  );

  const handleClose = () => {
    localStorage.setItem("isClosedBanner", JSON.stringify(true));
    setIsClosed(true);
  };

  return (
    <AnimatePresence>
      {!isClosed && (
        <motion.div
          key="welcomeBanner"
          initial={{ opacity: 0, y: "-10%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.5 }}
          className="relative min-2000px:rounded-[.7vw] rounded-lg shadow-sm dark:bg-black dark:text-[#f9f5e8] bg-white overflow-hidden w-full flex items-center justify-between max-768px:p-4 min-2000px:p-[1.5vw] p-8"
        >
          <img
            src={muskots}
            className="max-768px:hidden rotate-[-0deg] z-[1] min-2000px:w-[14vw] w-[280px] absolute right-[3%] -bottom-[15%] opacity-95"
          />
          <GetStartedEllipse className="min-2000px:w-[20vw] absolute inset-0 h-full" />
          <div className="z-[2]">
            <h1 className="max-768px:text-[16px] min-2000px:text-[1.2vw] text-[20px] font-manrope font-[700] min-2000px:mb-[0.7vw] mb-5">
              {t("home.welcome_to_nairo")}
            </h1>
            <h2 className="max-768px:text-[14px] min-2000px:text-[.8vw] relative z-[2] max-w-[68%] font-manrope font-[600] min-2000px:mb-[1.3vw] mb-7">
              {t("home.banner_description")}
            </h2>
            <p className="min-2000px:text-[1vw] text-[20px] font-manrope font-[700]">
              {t("home.banner_your_journey")}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="z-[2] absolute dark:bg-[#191a1a] bg-[#FFFFFF] border flex items-center justify-center dark:border-white/20 border-[#E5E7EB] min-2000px:rounded-[0.5vw] rounded-[12px] max-768px:size-8 min-2000px:size-[2vw] size-10 max-768px:top-4 min-2000px:top-[1.3vw] top-[32px] max-768px:right-4 min-2000px:right-[1.3vw] right-[32px] cursor-pointer hover:ring-2 hover:ring-main/50 duration-300"
          >
            <TfiClose className="max-768px:text-[14px] min-2000px:text-[.8vw]" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

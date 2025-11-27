import { useTranslation } from "react-i18next";
import muskots from "../../../../../../assets/images/happyMuskots.webp";
import { motion } from "framer-motion";
import { useState } from "react";
import { RandomConnectModal } from "../RandomConnectModal";

export const RandomConnect = () => {
  const { t } = useTranslation();
  const [isRandomModal, setIsRandomModal] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: "20%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "20%" }}
      transition={{ duration: 0.5 }}
      className="relative bg-white p-4 pb-0 rounded-xl shadow h-[max-content] flex flex-col gap-3 w-[30%] max-w-[400px]"
    >
      <h2 className="text-[20px] font-manrope font-semibold">
        {" "}
        {t("home.random_connect")}
      </h2>
      <div className="font-manrope">
        <p className="text-[14px]">{t("home.random_connect_desc")}</p>
        <div className="flex flex-col items-center justify-between">
          <button
            onClick={() => setIsRandomModal(true)}
            className="w-full mt-5 bg-gray-900 text-white px-4 py-2 rounded-md hover:ring-2 ring-main/70 duration-300 cursor-pointer"
          >
            {t("home.discover_button")}
          </button>
          <img
            src={muskots}
            className="pointer-events-none select-none w-[200px]"
          />
        </div>
      </div>
      <RandomConnectModal
        isOpen={isRandomModal}
        onClose={() => setIsRandomModal(false)}
      />
    </motion.div>
  );
};

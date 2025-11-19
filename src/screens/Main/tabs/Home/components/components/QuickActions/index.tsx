import { useTranslation } from "react-i18next";
import nairoCoin from "../../../../../../../assets/images/nairoCoin2.webp";
import nairoPremium from "../../../../../../../assets/images/nairoPremium.webp";
import { motion } from "framer-motion";

export const QuickActions = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="font-manrope"
    >
      <h2 className="text-[20px] font-[600] mb-5">
        {" "}
        {t("home.quick_actions")}
      </h2>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 border border-[#E5E7EB] bg-white px-4 py-2 rounded-lg hover:ring-2 hover:ring-main/50 duration-300 cursor-pointer">
          <img src={nairoPremium} className="w-[20px]" />
          {t("home.get_premium")}
        </button>
        <button className="flex items-center gap-2 border border-[#E5E7EB] bg-white px-4 py-2 rounded-lg hover:ring-2 hover:ring-main/50 duration-300 cursor-pointer">
          <img src={nairoCoin} className="w-[20px]" />
          {t("home.buy_nairo_coins")}
        </button>
        <button className="flex items-center gap-2 border border-[#E5E7EB] bg-white px-4 py-2 rounded-lg hover:ring-2 hover:ring-main/50 duration-300 cursor-pointer">
          👥 <span> {t("home.invite_friends")}</span>
        </button>
      </div>
    </motion.div>
  );
};

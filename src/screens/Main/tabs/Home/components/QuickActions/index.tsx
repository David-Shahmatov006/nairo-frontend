import { useTranslation } from "react-i18next";
import nairoCoin from "../../../../../../assets/images/nairoCoin2.webp";
import nairoPremium from "../../../../../../assets/images/nairoPremium.webp";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../../../routes";
import { useState } from "react";
import { InviteFriendsModal } from "../InviteFriendsModal";
import { PremiumModal } from "../PremiumModal";

export const QuickActions = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="font-manrope dark:text-[#f9f5e8]"
      >
        <h2 className="text-[20px] font-[600] mb-5">
          {" "}
          {t("home.quick_actions")}
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPremiumOpen(true)}
            className="flex items-center gap-2 border border-[#E5E7EB] dark:bg-white/5 dark:border-white/20 bg-white px-4 py-2 rounded-lg hover:ring-2 hover:ring-main/50 duration-300 cursor-pointer"
          >
            <img src={nairoPremium} className="w-[20px]" />
            {t("home.get_premium")}
          </button>
          <Link to={ROUTES.SHOP}>
            <button className="flex items-center gap-2 border border-[#E5E7EB] dark:bg-white/5 dark:border-white/20 bg-white px-4 py-2 rounded-lg hover:ring-2 hover:ring-main/50 duration-300 cursor-pointer">
              <img src={nairoCoin} className="w-[20px]" />
              {t("home.buy_nairo_coins")}
            </button>
          </Link>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 border border-[#E5E7EB] dark:bg-white/5 dark:border-white/20 bg-white px-4 py-2 rounded-lg hover:ring-2 hover:ring-main/50 duration-300 cursor-pointer"
          >
            👥 <span> {t("home.invite_friends")}</span>
          </button>
        </div>
      </motion.div>

      <InviteFriendsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        referralCode="USER123"
        invitedFriends={5}
        earnedRewards={250}
      />
      <PremiumModal
        isOpen={isPremiumOpen}
        onClose={() => setIsPremiumOpen(false)}
        onBuy={() => console.log("Buying premium...")}
      />
    </>
  );
};

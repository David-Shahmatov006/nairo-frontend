import { motion, AnimatePresence } from "framer-motion";
import { IoIosClose } from "react-icons/io";
import { FaCrown, FaFireAlt, FaGem } from "react-icons/fa";
import nairoPremium from "../../../../../../assets/images/nairoPremium.webp";
import { IoMoon } from "react-icons/io5";
import { useTranslation } from "react-i18next";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuy: () => void;
}

export const PremiumModal = ({ isOpen, onClose, onBuy }: PremiumModalProps) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={onClose}
          className="font-manrope fixed inset-0 bg-black/40 backdrop-blur-xl z-[80] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="
            relative bg-white/90 backdrop-blur-2xl border border-gray-200 
            shadow-[0_8px_35px_rgba(0,0,0,0.08)]
            rounded-3xl max-w-lg w-full p-8 text-gray-900
          "
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-gray-300 hover:ring-2 ring-main/40 cursor-pointer duration-300 rounded-full p-1"
            >
              <IoIosClose size={24} className="text-gray-700" />
            </button>

            <div className="flex flex-col items-center mb-8">
              <img
                src={nairoPremium}
                className="w-16"
              />

              <h2 className="text-[28px] font-[700] mt-4 text-gray-900">
                Nairo Premium
              </h2>
              <p className="text-gray-600 text-center mt-2 text-[15px]">
                {t("premium.subtitle")}
              </p>
            </div>

            <h3 className="font-semibold text-lg text-gray-900 mb-3">
              {t("premium.premium_features")}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <FeatureCard
                icon={<FaFireAlt className="text-orange-500" />}
                title={t("premium.animated_avatars_title")}
                description={t("premium.animated_avatars_subtitle")}
              />
              <FeatureCard
                icon={<FaGem className="text-[#8b53ff]" />}
                title={t("premium.uniq_reactions_title")}
                description={t("premium.uniq_reactions_subtitle")}
              />
              <FeatureCard
                icon={<IoMoon className="text-gray-800" />}
                title={t("premium.dark_mode_title")}
                description={t("premium.dark_mode_subtitle")}
              />
              <FeatureCard
                icon={<FaCrown className="text-yellow-500" />}
                title={t("premium.premium_badges_title")}
                description={t("premium.premium_badges_subtitle")}
              />
            </div>

            <div className="bg-white/90 border border-gray-200 rounded-2xl p-6 shadow-md text-center">
              <p className="text-xl font-bold text-gray-900 mb-1">
                $9.99 / {t("premium.pay_per_month")}
              </p>
              <p className="text-gray-500 text-sm mb-4">
                {t("premium.cancel_anytime")}
              </p>

              <button
                onClick={onBuy}
                className="w-full bg-gradient-to-r from-[#8b53ff] to-[#b583ff] hover:opacity-90 
              text-white py-3 rounded-xl font-semibold text-[16px] shadow-lg transition cursor-pointer"
              >
                {t("premium.activate_premium")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FeatureCard = ({ icon, title, description }: any) => (
  <div
    className="bg-white/90 border border-gray-200 p-4 rounded-2xl 
    shadow-lg cursor-default"
  >
    <div className="text-xl mb-2">{icon}</div>
    <h4 className="font-semibold text-gray-900">{title}</h4>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

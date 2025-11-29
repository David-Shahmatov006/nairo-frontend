import { useState } from "react";
import { IoIosClose, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaWhatsapp, FaTelegramPlane, FaEnvelope } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface InviteFriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
  invitedFriends: number;
  earnedRewards: number;
}

export const InviteFriendsModal = ({
  isOpen,
  onClose,
  referralCode,
  invitedFriends,
  earnedRewards,
}: InviteFriendsModalProps) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const referralLink = `https://myapp.com/signup?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialShare = {
    whatsapp: `https://wa.me/?text=Join Nairo Community!: ${referralLink}`,
    telegram: `https://t.me/share/url?url=${referralLink}&text=Join Nairo Community!`,
    email: `mailto:?subject=Join Nairo Community!&body=Sign up using my referral link: ${referralLink}`,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={onClose}
          className="font-manrope fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ translateY: 40, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: 40, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md dark:bg-black/50 bg-white rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[24px] font-[700] dark:text-white/80 text-gray-800">
                {t("invite_friends.title")}
              </h2>
              <button
                onClick={onClose}
                className="dark:bg-white/7 bg-gray-200 hover:ring-2 ring-main/70 cursor-pointer duration-300 p-1 rounded-full"
              >
                <IoIosClose
                  size={26}
                  className="dark:text-white/70 text-gray-700"
                />
              </button>
            </div>

            <p
              dangerouslySetInnerHTML={{ __html: t("invite_friends.subtitle") }}
              className="text-gray-600 mb-6 text-[15px]"
            />

            <div className="dark:bg-black/30 bg-gray-100 border dark:border-white/10 border-gray-200 rounded-2xl px-4 py-2 flex items-center gap-3 mb-6 shadow-sm">
              <span className="font-mono text-[18px] font-bold dark:text-white text-gray-900 tracking-wider">
                {referralCode}
              </span>

              <button
                onClick={handleCopy}
                className="ml-auto flex items-center justify-center dark:bg-white/10 bg-gray-900 hover:ring-2 ring-main/70 text-white p-2 rounded-xl duration-300 cursor-pointer w-[42px] h-[42px]"
              >
                {copied ? (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="text-white text-[25px]"
                  >
                    <IoMdCheckmarkCircleOutline />
                  </motion.span>
                ) : (
                  <MdContentCopy size={20} />
                )}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <a
                href={socialShare.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-3 rounded-2xl dark:bg-white/7 bg-green-50 hover:bg-green-100 transition"
              >
                <div className="size-12 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <FaWhatsapp size={22} />
                </div>
                <span className="mt-2 text-sm font-medium text-green-700">
                  WhatsApp
                </span>
              </a>

              <a
                href={socialShare.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-3 rounded-2xl dark:bg-white/7  bg-blue-50 hover:bg-blue-100 transition"
              >
                <div className="size-12 rounded-full bg-sky-500 flex items-center justify-center text-white">
                  <FaTelegramPlane size={22} />
                </div>
                <span className="mt-2 text-sm font-medium text-sky-700">
                  Telegram
                </span>
              </a>

              <a
                href={socialShare.email}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-3 rounded-2xl dark:bg-white/7  bg-gray-100 hover:bg-gray-200 transition"
              >
                <div className="size-12 rounded-full bg-gray-800 flex items-center justify-center text-white">
                  <FaEnvelope size={20} />
                </div>
                <span className="mt-2 text-sm font-medium dark:text-white/70 text-gray-700">
                  Email
                </span>
              </a>
            </div>

            <div className="flex justify-between gap-4">
              <div className="flex-1 dark:bg-white/7  bg-gray-100 rounded-2xl p-4 text-center shadow-sm">
                <span className="text-[22px] font-bold dark:text-white/90 text-gray-900">
                  {invitedFriends}
                </span>
                <p className="dark:text-white/30 text-gray-600 text-sm mt-1">
                  {t("invite_friends.joined")}
                </p>
              </div>

              <div className="flex-1 dark:bg-white/7  bg-gray-100 rounded-2xl p-4 text-center shadow-sm">
                <span className="dark:text-white/90 text-[22px] font-bold text-gray-900">
                  {earnedRewards} NC
                </span>
                <p className="dark:text-white/30 text-gray-600 text-sm mt-1">
                  {t("invite_friends.earned")}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

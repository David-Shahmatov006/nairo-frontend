import { motion, AnimatePresence } from "framer-motion";
import { IoIosClose } from "react-icons/io";
import { defaultEmojis } from "../../../../../constants/emojis";
import { useTranslation } from "react-i18next";

export const EmojiPickerModal = ({ isOpen, onClose, onSelect }: any) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="font-manrope fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="dark:bg-black/50 bg-white w-[320px] rounded-2xl p-4 shadow-xl"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-semibold dark:text-white/80 text-gray-900 text-[20px]">
                {t("emoji_modal.default_emojis")}
              </h2>
              <button
                className="size-7 flex items-center justify-center rounded-full dark:bg-white/10 bg-gray-200 cursor-pointer hover:ring-2 ring-main/70 duration-300"
                onClick={onClose}
              >
                <IoIosClose className="dark:text-white/30" size={26} />
              </button>
            </div>

            <div className="grid grid-cols-6 gap-4 mb-4 max-h-[20vh] overflow-x-hidden overflow-y-auto custom-scrollbar">
              {defaultEmojis.map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelect({ type: "default", value: emoji });
                    onClose();
                  }}
                  className="w-10 h-10 flex items-center justify-center text-[20px] dark:hover:bg-white/10 hover:bg-gray-100 rounded-xl cursor-pointer duration-300"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

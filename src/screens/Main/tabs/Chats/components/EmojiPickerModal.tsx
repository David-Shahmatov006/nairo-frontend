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
            className="dark:bg-black/50 bg-white min-2000px:w-[15vw] w-[320px] min-2000px:rounded-[.5vw] rounded-2xl min-2000px:p-[.5vw] p-4 shadow-xl"
          >
            <div className="flex justify-between items-center min-2000px:mb-[.5vw] mb-5">
              <h2 className="font-semibold dark:text-white/80 text-gray-900 min-2000px:text-[1vw] text-[20px]">
                {t("emoji_modal.default_emojis")}
              </h2>
              <button
                className="min-2000px:size-[1.2vw] size-7 flex items-center justify-center rounded-full dark:bg-white/10 bg-gray-200 cursor-pointer hover:ring-2 ring-main/70 duration-300"
                onClick={onClose}
              >
                <IoIosClose className="dark:text-white/30 min-2000px:text-[1vw] text-[26vw]" />
              </button>
            </div>

            <div className="grid grid-cols-6 min-2000px:gap-[.5vw] gap-4 min-2000px:mb-[.4vw] mb-4 max-h-[20vh] overflow-x-hidden overflow-y-auto custom-scrollbar">
              {defaultEmojis.map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelect({ type: "default", value: emoji });
                    onClose();
                  }}
                  className="min-2000px:size-[1.3vw] size-10 flex items-center justify-center min-2000px:text-[1vw] text-[20px] dark:hover:bg-white/10 hover:bg-gray-100 rounded-xl cursor-pointer duration-300"
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

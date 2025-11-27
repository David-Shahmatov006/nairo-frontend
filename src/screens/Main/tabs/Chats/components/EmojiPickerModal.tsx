import { motion, AnimatePresence } from "framer-motion";
import { IoIosClose } from "react-icons/io";
import { customEmojis, defaultEmojis } from "../../../../../constants/emojis";

export const EmojiPickerModal = ({ isOpen, onClose, onSelect }: any) => {
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
            className="bg-white w-[320px] rounded-2xl p-4 shadow-xl"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-semibold text-gray-900 text-[20px]">
                Emojis
              </h2>
              <button
                className="size-7 flex items-center justify-center rounded-full bg-gray-200 cursor-pointer hover:ring-2 ring-main/40 duration-300"
                onClick={onClose}
              >
                <IoIosClose size={26} />
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
                  className="w-10 h-10 flex items-center justify-center text-[20px] hover:bg-gray-100 rounded-xl cursor-pointer duration-300"
                >
                  {emoji}
                </button>
              ))}
            </div>

            <h3 className="font-semibold text-gray-800 mb-2 text-[20px]">
              Custom Emojis
            </h3>

            <div className="grid grid-cols-6 gap-4 max-h-[20vh] overflow-x-hidden overflow-y-auto custom-scrollbar">
              {customEmojis.map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelect({ type: "custom", value: emoji });
                    onClose();
                  }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 overflow-hidden cursor-pointer duration-300"
                >
                  <img src={emoji.src} className="size-5 object-contain" />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

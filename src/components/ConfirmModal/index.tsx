import { AnimatePresence, motion } from "framer-motion";
import { IoIosClose } from "react-icons/io";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  subtitle?: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  subtitle,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="font-manrope fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center min-2000px:px-[.5vw] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="dark:bg-[#191a1a] bg-white w-full min-2000px:max-w-[15vw] max-w-[360px] min-2000px:rounded-[.5vw] rounded-2xl min-2000px:p-[.6vw] p-6 shadow-xl"
          >
            <div className="flex items-center justify-between min-2000px:mb-[.3vw] mb-2">
              <h2 className="min-2000px:text-[.9vw] text-[20px] font-[700] dark:text-white/80 text-gray-900 min-2000px:mb-[.3vw] mb-2">
                {title}
              </h2>
              <button onClick={onClose}>
                <IoIosClose
                  className="min-2000px:size-[1.1vw] size-7 rounded-full dark:bg-white/10 dark:text-white/80 bg-gray-200 flex items-center justify-center hover:ring-2 ring-main/70 cursor-pointer duration-300"
                />
              </button>
            </div>

            {subtitle && (
              <p className="font-[500] text-gray-500 min-2000px:text-[.7vw] text-[15px] leading-[1.4] min-2000px:mb-[.7vw] mb-6">
                {subtitle}
              </p>
            )}

            <div className="flex items-center min-2000px:gap-[.4vw] gap-3">
              <button
                onClick={onClose}
                className="dark:text-white/80 cursor-pointer flex-1 min-2000px:h-[1.3vw] h-11 min-2000px:rounded-[.3vw] rounded-xl border dark:border-white/10 border-gray-300 text-gray-700 dark:hover:bg-white/5 hover:bg-gray-100 duration-300 font-[500] min-2000px:text-[.6vw]"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className="cursor-pointer flex-1 min-2000px:h-[1.3vw] h-11 min-2000px:rounded-[.3vw] rounded-xl border dark:border-white/10 border-gray-300 text-gray-700 dark:bg-black/50 bg-gray-900 text-white hover:ring-2 ring-main/70 duration-300 font-[500] min-2000px:text-[.6vw]"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

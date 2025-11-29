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
          className="font-manrope fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center px-4"
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
            className="dark:bg-[#191a1a] bg-white w-full max-w-[360px] rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[20px] font-[700] dark:text-white/80 text-gray-900 mb-2">
                {title}
              </h2>
              <button onClick={onClose}>
                <IoIosClose
                  size={28}
                  className="size-7 rounded-full dark:bg-white/10 dark:text-white/80 bg-gray-200 flex items-center justify-center hover:ring-2 ring-main/70 cursor-pointer duration-300"
                />
              </button>
            </div>

            {subtitle && (
              <p className="font-[500] text-gray-500 text-[15px] leading-[1.4] mb-6">
                {subtitle}
              </p>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="dark:text-white/80 cursor-pointer flex-1 h-11 rounded-xl border dark:border-white/10 border-gray-300 text-gray-700 dark:hover:bg-white/5 hover:bg-gray-100 duration-300 font-[500]"
              >
                {cancelText}
              </button>

              <button
                onClick={onConfirm}
                className="cursor-pointer flex-1 h-11 rounded-xl dark:bg-black/50 bg-gray-900 text-white hover:ring-2 ring-main/70 duration-300 font-[500]"
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

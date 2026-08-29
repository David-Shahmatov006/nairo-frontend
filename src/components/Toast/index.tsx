import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUpRight, FiX, FiMessageCircle } from "react-icons/fi";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { IMessage } from "../../types/chats";
import { AvatarImage } from "../AvatarImage";

interface ToastProps {
  open: boolean;
  message: IMessage;

  duration?: number;

  onClose: () => void;
  onOpenChat: () => void;
}

export const Toast = ({
  open,
  message,
  duration = 5000,
  onClose,
  onOpenChat,
}: ToastProps) => {
  const { t } = useTranslation();
  const isMobile = window.innerWidth <= 768;
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(onClose, duration);

    return () => clearTimeout(timer);
  }, [open, duration]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: 250, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 250, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 360,
            damping: 28,
          }}
          drag={isMobile ? "x" : false}
          dragDirectionLock
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          whileDrag={{ scale: 0.96 }}
          onDragEnd={(_, info) => {
            if (info.offset.x > 120 || info.velocity.x > 500) {
              onClose();
            }
          }}
          className="fixed max-500px:right-1/2 max-500px:translate-x-1/2 min-2000px:right-[3vw] right-5 min-2000px:top-[5vw] top-24 z-[9999]"
        >
          <div
            onClick={onOpenChat}
            className="relative max-500px:w-[95vw] min-2000px:w-[19vw] w-[360px] overflow-hidden min-2000px:rounded-[.6vw] rounded-[15px] border border-main/10 bg-white/90 dark:bg-[#181818]/95 backdrop-blur-xl cursor-pointer"
          >
            <div className="flex items-start min-2000px:gap-[.4vw] gap-4 min-2000px:p-[.5vw] p-3">
              <div className="min-2000px:size-[2.3vw] size-11">
                <AvatarImage src={message.sender?.avatar || ""} />
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="flex items-center min-2000px:gap-[.3vw] gap-2">
                  <FiMessageCircle className="min-2000px:text-[.8vw] text-main shrink-0" />

                  <span className="truncate font-semibold min-2000px:text-[.8vw] text-[15px] dark:text-white">
                    {`${message.sender.firstName} ${message.sender.lastName}`}
                  </span>
                </div>

                <p className="min-2000px:mt-[.1vw] mt-1 truncate min-2000px:text-[.7vw] text-[13px] text-gray-500 dark:text-white/60">
                  {message.type === "voice"
                    ? t("chat.voice_message")
                    : message.text}
                </p>
              </div>

              <div className="flex items-center min-2000px:gap-[.1vw] gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenChat();
                  }}
                  className="cursor-pointer min-2000px:rounded-[.4vw] rounded-lg min-2000px:p-[.3vw] p-2 text-main hover:bg-main/10 duration-300"
                >
                  <FiArrowUpRight className="text-[18px] min-2000px:text-[1.1vw]" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="cursor-pointer min-2000px:rounded-[.4vw] rounded-lg min-2000px:p-[.3vw] p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-white/5 duration-300"
                >
                  <FiX className="text-[18px] min-2000px:text-[1.1vw]" />
                </button>
              </div>
            </div>

            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: 0 }}
              transition={{
                duration: duration / 1000,
                ease: "linear",
              }}
              className="min-2000px:h-[.1vw] h-[3px] bg-main"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatTime } from "../../../../../utils/formatDate";
import type { IMessage } from "../../../../../types/chats";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { EditModal } from "../../../../../components/EditModal";
import { useTranslation } from "react-i18next";
import { ConfirmModal } from "../../../../../components/ConfirmModal";
import { useAuthStore } from "../../../../../stores/auth";
import { LuCopy } from "react-icons/lu";

interface IProps {
  message: IMessage;
  onDelete: (messageId: string) => void;
}

export const Message = ({ message, onDelete }: IProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const { t } = useTranslation();
  const userId = useAuthStore((s) => s.user?.id);
  const timer = useRef<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const fromMe = message.sender.id === userId;

  const handleCopyMessage = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error(err);
    }
  };

  const startLongPress = () => {
    if (!fromMe) return;

    setIsHolding(true);

    timer.current = window.setTimeout(() => {
      setIsHolding(false);
      setMenuOpen(true);
    }, 250);
  };

  const cancelLongPress = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    setIsHolding(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <motion.div
        animate={{
          scale: isHolding ? 0.9 : 1,
        }}
        transition={{
          duration: 0.33,
          ease: "easeOut",
        }}
        className={clsx(
          "w-fit min-w-[13%] min-2000px:max-w-[20vw] max-w-[30rem] rounded-xl border px-3 py-2 relative",
          fromMe
            ? "ml-auto dark:bg-main/20 bg-main/10 dark:border-main/30 border-main/10"
            : "dark:bg-white/10 bg-white dark:border-white/15 border-gray-200",
        )}
        onContextMenu={(e) => {
          if (!fromMe) return;

          e.preventDefault();
          setMenuOpen(true);
        }}
        onTouchStart={startLongPress}
        onTouchEnd={cancelLongPress}
        onTouchMove={cancelLongPress}
      >
        <div
          className="min-2000px:text-[.8vw] text-[15px] dark:text-white/80 whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{ __html: message.text }}
        />

        <div className="w-full flex justify-between gap-1 items-center mt-1">
          {message.editedAt && (
            <span className="select-none text-[10px] text-gray-400 italic">
              {t("chat.edited_label")}
            </span>
          )}

          <span className="select-none min-2000px:text-[.5vw] text-[11px] text-gray-500">
            {formatTime(message.createdAt)}
          </span>
        </div>
      </motion.div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            className={clsx(
              "absolute z-50 overflow-hidden min-2000px:rounded-[.5vw] rounded-[17px] border border-gray-200/70 dark:border-white/10 bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,.18)] min-2000px:min-w-[7vw] min-w-[130px] min-2000px:p-[.2vw] p-1.5 min-2000px:right-[5vw] right-[5%] top-[105%]",
            )}
          >
            <button
              onClick={() => {
                setIsOpenEditModal(true);
                setMenuOpen(false);
              }}
              className="group flex w-full items-center min-2000px:gap-[.3vw] gap-2 min-2000px:rounded-[.4vw] rounded-xl min-2000px:px-[.4vw] px-3 min-2000px:py-[.3vw] py-2 text-[14px] font-medium text-gray-700 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              <FiEdit2 className="min-2000px:text-[.6vw] text-[15px] group-hover:text-main duration-300 group-hover:scale-110" />
              <span className="min-2000px:text-[.7vw]">
                {t("chat.edit_message")}
              </span>
            </button>

            <button
              onClick={() => {
                handleCopyMessage(message.text);
                setMenuOpen(false);
              }}
              className="group flex w-full items-center min-2000px:gap-[.3vw] gap-2 min-2000px:rounded-[.4vw] rounded-xl min-2000px:px-[.4vw] px-3 min-2000px:py-[.3vw] py-2 text-[14px] font-medium text-gray-700 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              <LuCopy className="min-2000px:text-[.6vw] text-[15px] group-hover:text-main duration-300 group-hover:scale-110" />
              <span className="min-2000px:text-[.7vw]">
                {t("chat.copy_message")}
              </span>
            </button>

            <div className="mx-2 my-1 h-px bg-gray-200 dark:bg-white/10" />

            <button
              onClick={() => {
                setIsOpenDeleteModal(true);
                setMenuOpen(false);
              }}
              className="group flex w-full items-center min-2000px:gap-[.3vw] gap-2 min-2000px:rounded-[.4vw] rounded-xl min-2000px:px-[.4vw] px-3 min-2000px:py-[.3vw] py-2 text-[14px] font-medium text-gray-700 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              <FiTrash2 className="min-2000px:text-[.6vw] text-[15px] group-hover:text-red-400 duration-300 group-hover:scale-110" />
              <span className="min-2000px:text-[.7vw]">
                {t("chat.delete_message")}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <EditModal
        title={t("chat.edit_message")}
        isOpen={isOpenEditModal}
        onClose={() => {
          setIsOpenEditModal(false);
          setMenuOpen(false);
        }}
        initialText={message.text}
        targetId={message.id}
        type="message"
      />

      <ConfirmModal
        isOpen={isOpenDeleteModal}
        onClose={() => setIsOpenDeleteModal(false)}
        onConfirm={() => {
          if (message) {
            try {
              onDelete(message.id);
            } catch (error) {
              console.error(error);
            } finally {
              setIsOpenDeleteModal(false);
            }
          }
        }}
        title={t("chat.delete_message")}
        subtitle={t("chat.delete_message_subtitle")}
        confirmText={t("chat.delete_modal_confirm")}
        cancelText={t("chat.confirm_modal_cancel")}
      />
    </div>
  );
};

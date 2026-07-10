import { motion, AnimatePresence } from "framer-motion";
import { IoIosClose } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { commentsService } from "../../../../../../../../../../../services/comments.service";
import { BiLoaderAlt } from "react-icons/bi";
import { mutate } from "swr";

interface EditCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText: string;
  commentId: string;
  postId: string;
}

export const EditCommentModal = ({
  isOpen,
  onClose,
  initialText,
  commentId,
  postId,
}: EditCommentModalProps) => {
  const { t } = useTranslation();
  const [text, setText] = useState(initialText);
  const [isUpdating, setIsUpdating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpdateComment = async () => {
    setIsUpdating(true);
    try {
      await commentsService.updateComment(text, commentId);
      mutate(["comments", postId]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setText(initialText);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, initialText]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-[#101010] min-2000px:rounded-[.5vw] rounded-2xl shadow-xl min-2000px:px-[.7vw] px-6 min-2000px:py-[.5vw] py-5 w-[90%] min-2000px:max-w-[20%] max-w-md text-gray-900 dark:text-white/80 relative"
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.35 }}
          >
            <div className="min-2000px:mb-[.5vw] mb-4 flex items-center justify-between">
              <h2 className="min-2000px:text-[1vw] text-xl font-semibold">{t("edit_comment")}</h2>
              <button
                onClick={onClose}
                className="cursor-pointer min-2000px:size-[1.2vw] size-7 dark:bg-white/10 bg-gray-200 flex items-center justify-center rounded-full text-gray-500 hover:ring-2 ring-main/70 duration-300"
              >
                <IoIosClose className="min-2000px:text-[1vw] text-[32px]" />
              </button>
            </div>

            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-2000px:text-[.7vw] w-full min-2000px:px-[.5vw] px-4 min-2000px:py-[.3vw] py-3 min-2000px:rounded-[.5vw] rounded-xl bg-gray-100 dark:bg-white/10 outline-none focus:ring-2 ring-main/70 duration-300"
            />

            <div className="flex max-768px:justify-center justify-end min-2000px:gap-[.5vw] gap-3 min-2000px:mt-[1vw] mt-6">
              <button
                onClick={onClose}
                className="min-2000px:text-[.7vw] font-medium cursor-pointer min-2000px:px-[.5vw] px-4 min-2000px:py-[.3vw] py-2 min-2000px:rounded-[.3vw] rounded-xl bg-gray-200 dark:text-white/70 dark:bg-white/5 text-gray-700 hover:ring-2 ring-main/70 duration-300"
              >
                {t("cancel")}
              </button>

              <button
                disabled={isUpdating || !text.length}
                onClick={handleUpdateComment}
                className="min-2000px:text-[.7vw] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:ring-0 min-2000px:min-w-[4vw] min-w-[110px] flex items-center justify-center font-medium cursor-pointer px-4 py-2 min-2000px:rounded-[.3vw] rounded-xl bg-gray-900 dark:bg-white/10 text-white hover:ring-2 ring-main/70 duration-300"
              >
                {isUpdating ? (
                  <BiLoaderAlt className="animate-spin text-[20px]" />
                ) : (
                  t("save")
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

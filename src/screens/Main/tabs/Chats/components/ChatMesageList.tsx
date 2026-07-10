import clsx from "clsx";
import type { RefObject } from "react";
import type { UIMessage } from "../../../../../types/chats";
import { useTranslation } from "react-i18next";
import surprisedMuskot from "../../../../../assets/images/surprisedMuskot.webp";
import ScrollToBottom from "react-scroll-to-bottom";
import { ScrollButton } from "../../../../../components/ScrollButton";
import { motion } from "framer-motion";
import { formatTime } from "../../../../../utils/formatDate";

interface ChatMessageListProps {
  messages: UIMessage[];
  isTyping: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export const ChatMessageList = ({
  messages,
  isTyping,
  messagesEndRef,
}: ChatMessageListProps) => {
  const { t } = useTranslation();

  if (!messages.length) {
    return (
      <div className="flex-1 max-h-[70vh] flex flex-col justify-center items-center">
        <img src={surprisedMuskot} className="min-2000px:w-[7vw] w-[120px]" />
        <p className="text-gray-500 text-center min-2000px:text-[.8vw] py-4">
          {t("chat.no_messages")}
        </p>
      </div>
    );
  }

  return (
    <ScrollToBottom
      scrollViewClassName="scrollbar-hidden"
      className="chat-scroll-container chat-scroll flex-1 max-768px:max-h-[80vh] min-2000px:max-h-[46.5vw] max-h-[70vh] min-2000px:px-[.5vw] px-5 min-2000px:pt-[.4vw] pt-4 relative custom-scrollbar"
    >
      <div className="flex flex-col min-2000px:gap-[.3vw] gap-3 custom-scrollbar">
        {messages.map((msg) => {
          return (
            <div
              key={msg.id}
              className={clsx(
                "w-fit min-2000px:max-w-[20vw] max-w-[30rem] max-768px:py-2 max-768px:px-3 min-2000px:px-[.5vw] px-5 min-2000px:py-[.2vw] py-3 min-2000px:rounded-[.4vw] rounded-xl border",
                msg.fromMe
                  ? "ml-auto dark:bg-main/20 bg-main/10 dark:border-main/30 border-main/10"
                  : "dark:bg-white/10 bg-white dark:border-white/15 border-gray-200"
              )}
            >
              <div
                className="min-2000px:text-[.8vw] max-768px:text-[14px] dark:text-white/80 whitespace-pre-wrap break-words"
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
              <div className="min-2000px:text-[.6vw] text-[11px] text-gray-500 min-2000px:mt-[.2vw] mt-1">
                {formatTime(msg.time)}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>
      {isTyping && (
        <div className="dark:bg-white/10 bg-gray-200 absolute min-2000px:left-[.3vw] left-3 min-2000px:bottom-[.5vw] bottom-5 flex items-center min-2000px:gap-[.2vw] gap-1 min-2000px:p-[.5vw] p-3 rounded-full">
          <motion.span
            className="min-2000px:size-[.4vw] size-2 bg-main/40 rounded-full"
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.span
            className="min-2000px:size-[.4vw] size-2 bg-main/40 rounded-full"
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 1, 0.4] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.15,
            }}
          />

          <motion.span
            className="min-2000px:size-[.4vw] size-2 bg-main/40 rounded-full"
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />
        </div>
      )}

      <ScrollButton />
    </ScrollToBottom>
  );
};

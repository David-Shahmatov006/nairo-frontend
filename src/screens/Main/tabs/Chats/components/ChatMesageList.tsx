import clsx from "clsx";
import { type RefObject } from "react";
import type { IMessage } from "../../../../../types/chats";
import { useTranslation } from "react-i18next";
import surprisedMuskot from "../../../../../assets/images/surprisedMuskot.webp";
import ScrollToBottom from "react-scroll-to-bottom";
import { ScrollButton } from "../../../../../components/ScrollButton";
import { motion } from "framer-motion";
import { Message } from "./Message";
import { socket } from "../../../../../services/socket.service";
import { useAuthStore } from "../../../../../stores/auth";

interface ChatMessageListProps {
  messages: IMessage[];
  isTyping: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

const isIOSChrome = /CriOS/i.test(navigator.userAgent);

export const ChatMessageList = ({
  messages,
  isTyping,
  messagesEndRef,
}: ChatMessageListProps) => {
  const { t } = useTranslation();
  const isChrome = isIOSChrome;
  const userId = useAuthStore((s) => s.user?.id);

  const handleDeleteMessage = (messageId: string) => {
    socket.emit("deleteMessage", { messageId, userId });
  };

  return (
    <ScrollToBottom
      scrollViewClassName="scrollbar-hidden"
      className="chat-scroll-container chat-scroll flex-1  min-2000px:px-[.5vw] px-5 min-2000px:pt-[.4vw] pt-4 pb-2 relative custom-scrollbar"
    >
      <div
        className={clsx(
          "min-2000px:max-h-[46.5vw] max-h-[70vh] flex flex-col min-2000px:gap-[.3vw] gap-3 custom-scrollbar",
          isChrome ? "max-768px:max-h-[70vh]" : "max-768px:max-h-[78vh]",
        )}
      >
        {messages.length ? (
          messages.map((msg) => (
            <Message
              key={msg.id}
              onDelete={handleDeleteMessage}
              message={msg}
            />
          ))
        ) : (
          <div className="h-[70vh]">
            <div className="flex-1 h-full flex flex-col justify-center items-center">
              <img
                src={surprisedMuskot}
                className="min-2000px:w-[7vw] w-[120px]"
              />
              <p className="text-gray-500 text-center min-2000px:text-[.8vw] py-4">
                {t("chat.no_messages")}
              </p>
            </div>
          </div>
        )}

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

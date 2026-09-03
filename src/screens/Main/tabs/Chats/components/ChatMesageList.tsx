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
import { FaMicrophone } from "react-icons/fa";

interface ChatMessageListProps {
  messages: IMessage[];
  isTyping: boolean;
  isRecording: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

const FAKE_WAVEFORM_BARS = [0, 1, 2, 3, 4];

export const ChatMessageList = ({
  messages,
  isTyping,
  isRecording,
  messagesEndRef,
}: ChatMessageListProps) => {
  const { t } = useTranslation();
  const userId = useAuthStore((s) => s.user?.id);

  const handleDeleteMessage = (messageId: string) => {
    socket.emit("deleteMessage", { messageId, userId });
  };

  return (
    <ScrollToBottom
      scrollViewClassName="scrollbar-hidden"
      className="chat-scroll-container chat-scroll flex-1 min-h-0 min-2000px:px-[.5vw] px-5 min-2000px:pt-[.4vw] pt-4 pb-2 relative custom-scrollbar"
    >
      <div className="flex flex-col min-h-full min-2000px:gap-[.3vw] gap-3 custom-scrollbar">
        {messages.length ? (
          messages.map((msg) => (
            <Message
              key={msg.id}
              onDelete={handleDeleteMessage}
              message={msg}
            />
          ))
        ) : (
          <div className="flex-1">
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
      {(isRecording || isTyping) && (
        <div
          aria-live="polite"
          aria-label={isRecording ? t("chat.peer_recording") : undefined}
          className="dark:bg-white/10 bg-gray-200 absolute min-2000px:left-[.3vw] left-3 min-2000px:bottom-[.5vw] bottom-5 flex items-center min-2000px:gap-[.2vw] gap-1 min-2000px:p-[.5vw] p-3 rounded-full"
        >
          {isRecording ? (
            <>
              <motion.span
                className="flex items-center text-main"
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <FaMicrophone className="min-2000px:size-[.5vw] size-3" />
              </motion.span>
              {FAKE_WAVEFORM_BARS.map((index) => (
                <motion.span
                  key={index}
                  className="min-2000px:w-[.1vw] w-[2px] min-2000px:h-[.7vw] h-3 bg-main/70 rounded-full origin-bottom"
                  animate={{ scaleY: [0.35, 1, 0.35] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.1,
                  }}
                />
              ))}
            </>
          ) : (
            <>
              <motion.span
                className="min-2000px:size-[.4vw] size-2 bg-main/40 rounded-full"
                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
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
            </>
          )}
        </div>
      )}

      <ScrollButton />
    </ScrollToBottom>
  );
};

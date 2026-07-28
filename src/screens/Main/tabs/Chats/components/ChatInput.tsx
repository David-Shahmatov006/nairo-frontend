import { IoSend } from "react-icons/io5";
import { BsEmojiSunglasses } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { EmojiPickerModal } from "./EmojiPickerModal";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  activeChatId: string | null;
  socket: any;
  userId: string;
}

const MAX_LEN = 700;
const TYPING_DELAY = 1200;

export const ChatInput = ({
  onSendMessage,
  activeChatId,
  socket,
  userId,
}: ChatInputProps) => {
  const { t } = useTranslation();

  const [messageContent, setMessageContent] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  const emitTyping = () => {
    if (!activeChatId) return;

    socket.emit("typing", {
      chatId: activeChatId,
      userId,
      isTyping: true,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      socket.emit("typing", {
        chatId: activeChatId,
        userId,
        isTyping: false,
      });
    }, TYPING_DELAY);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, MAX_LEN);

    setMessageContent(value);
    emitTyping();
  };

  const handleSend = () => {
    if (!messageContent.trim()) return;

    onSendMessage(messageContent);

    setMessageContent("");

    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (activeChatId) {
      socket.emit("typing", {
        chatId: activeChatId,
        userId,
        isTyping: false,
      });
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    const value = emoji.value;

    if (typeof value !== "string") return;

    const input = inputRef.current;
    if (!input) return;

    input.focus();

    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    const newValue =
      messageContent.slice(0, start) +
      value +
      messageContent.slice(end);

    setMessageContent(newValue);

    requestAnimationFrame(() => {
      const pos = start + value.length;
      input.selectionStart = pos;
      input.selectionEnd = pos;
    });

    emitTyping();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isEmojiOpen) return;

      const input = inputRef.current;
      if (!input) return;

      const active = document.activeElement;

      if (
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.key.length !== 1
      ) {
        return;
      }

      input.focus();
    };

    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [isEmojiOpen]);

  return (
    <div className="mt-auto min-2000px:mb-[1vw] mb-5 min-2000px:px-[.4vw] px-4">
      <div className="flex items-center min-2000px:gap-[.4vw] gap-3 border dark:border-white/10 border-gray-300 min-2000px:rounded-[.3vw] rounded-xl min-2000px:px-[.4vw] px-3 min-2000px:py-[.2vw] py-1">
        <button
          onClick={() => setIsEmojiOpen(true)}
          className="cursor-pointer text-gray-500 hover:text-main duration-300"
        >
          <BsEmojiSunglasses className="text-[20px] min-2000px:text-[.9vw]" />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={messageContent}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          maxLength={MAX_LEN}
          placeholder={t("chat.type_message")}
          className="
            flex-1
            min-2000px:h-[1.5vw] h-5
            bg-transparent
            outline-none
            dark:text-white/80
            min-2000px:text-[.7vw] text-[16px]
          "
        />

        <button
          onClick={handleSend}
          className="cursor-pointer dark:bg-white/10 bg-gray-900 text-white min-2000px:px-[.6vw] px-4 min-2000px:py-[.4vw] py-2 min-2000px:rounded-[.3vw] rounded-lg hover:ring-2 ring-main/70 duration-300"
        >
          <IoSend className="text-[18px] min-2000px:text-[.7vw]" />
        </button>
      </div>

      <EmojiPickerModal
        isOpen={isEmojiOpen}
        onClose={() => setIsEmojiOpen(false)}
        onSelect={handleEmojiSelect}
      />
    </div>
  );
};
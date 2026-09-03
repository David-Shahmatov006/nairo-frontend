import { IoSend } from "react-icons/io5";
import { BsEmojiSunglasses } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { EmojiPickerModal } from "./EmojiPickerModal";
import {
  useVoiceRecorder,
  VOICE_MAX_DURATION_MS,
  VOICE_MIN_DURATION_MS,
} from "../../../../../hooks/useVoiceRecorder";
import { formatVoiceDuration } from "../../../../../utils/formatDate";
import type { VoiceRecording } from "../../../../../hooks/useVoiceRecorder";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onSendVoice: (recording: VoiceRecording) => void;
  activeChatId: string | null;
  socket: { emit: (event: string, payload: Record<string, unknown>) => void };
  userId: string;
}

const MAX_LEN = 700;
const TYPING_DELAY = 1200;

export const ChatInput = ({
  onSendMessage,
  onSendVoice,
  activeChatId,
  socket,
  userId,
}: ChatInputProps) => {
  const { t } = useTranslation();

  const [messageContent, setMessageContent] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const onSendVoiceRef = useRef(onSendVoice);
  const sentRecordingRef = useRef<VoiceRecording | null>(null);
  const {
    state,
    elapsedMs,
    livePeaks,
    result,
    start,
    stop,
    cancel,
  } = useVoiceRecorder();

  useEffect(() => {
    onSendVoiceRef.current = onSendVoice;
  }, [onSendVoice]);

  const isRecording = state === "recording" || state === "requesting";

  useEffect(() => {
    if (state !== "recording" || !activeChatId) {
      return;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    socket.emit("typing", {
      chatId: activeChatId,
      userId,
      isTyping: false,
    });

    socket.emit("recording", {
      chatId: activeChatId,
      userId,
      isRecording: true,
    });

    return () => {
      socket.emit("recording", {
        chatId: activeChatId,
        userId,
        isRecording: false,
      });
    };
  }, [state, activeChatId, userId, socket]);

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

  const handleEmojiSelect = (emoji: { value?: unknown }) => {
    const value = emoji.value;

    if (typeof value !== "string") return;

    const input = inputRef.current;
    if (!input) return;

    input.focus();

    const startPos = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    const newValue =
      messageContent.slice(0, startPos) +
      value +
      messageContent.slice(end);

    setMessageContent(newValue);

    requestAnimationFrame(() => {
      const pos = startPos + value.length;
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
    if (state !== "recorded" || !result) {
      return;
    }

    if (sentRecordingRef.current === result) {
      return;
    }

    sentRecordingRef.current = result;

    if (result.durationMs < VOICE_MIN_DURATION_MS) {
      cancel();
      return;
    }

    onSendVoiceRef.current(result);
    cancel();
  }, [state, result, cancel]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isEmojiOpen || isRecording) return;

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
  }, [isEmojiOpen, isRecording]);

  const errorMessage =
    state === "denied"
      ? t("chat.mic_denied")
      : state === "unsupported"
        ? t("chat.mic_unsupported")
        : elapsedMs >= VOICE_MAX_DURATION_MS
          ? t("chat.voice_too_long")
          : null;

  return (
    <div className="mt-auto shrink-0 min-2000px:mb-[1vw] mb-5 max-1024px:mb-0 max-1024px:pb-[max(12px,env(safe-area-inset-bottom))] min-2000px:px-[.4vw] max-1024px:px-3 px-4">
      {isRecording ? (
        <div
          aria-live="polite"
          aria-label={t("chat.recording")}
          className="flex items-center min-2000px:gap-[.4vw] gap-3 border dark:border-white/10 border-gray-300 dark:bg-[#0f0f0f] bg-white min-2000px:rounded-[.3vw] rounded-xl min-2000px:px-[.4vw] px-3 min-2000px:py-[.2vw] py-1"
        >
          <button
            type="button"
            onClick={cancel}
            aria-label={t("chat.cancel_recording")}
            className="cursor-pointer text-red-400 hover:text-red-500 duration-300"
          >
            <IoMdClose className="text-[22px] min-2000px:text-[.95vw]" />
          </button>

          <span className="select-none tabular-nums min-2000px:text-[.7vw] text-[14px] text-red-400 min-w-[3.2rem]">
            {formatVoiceDuration(elapsedMs)}
          </span>

          <div className="flex-1 flex items-end min-2000px:h-[1.4vw] h-6 min-2000px:gap-[.08vw] gap-[2px]">
            {livePeaks.map((value, index) => (
              <div
                key={index}
                className="flex-1 min-w-0 bg-main/80 min-2000px:rounded-[.05vw] rounded-sm"
                style={{ height: `${Math.max(8, value)}%` }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              void stop();
            }}
            aria-label={t("chat.send_voice")}
            className="cursor-pointer dark:bg-white/10 bg-gray-900 text-white min-2000px:px-[.6vw] px-4 min-2000px:py-[.4vw] py-2 min-2000px:rounded-[.3vw] rounded-lg hover:ring-2 ring-main/70 duration-300"
          >
            <IoSend className="text-[18px] min-2000px:text-[.7vw]" />
          </button>
        </div>
      ) : (
        <div className="flex items-center min-2000px:gap-[.4vw] gap-3 border dark:border-white/10 border-gray-300 dark:bg-[#0f0f0f] bg-white min-2000px:rounded-[.3vw] rounded-xl min-2000px:px-[.4vw] px-3 min-2000px:py-[.2vw] py-1">
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

          {messageContent.trim() ? (
            <button
              onClick={handleSend}
              className="cursor-pointer dark:bg-white/10 bg-gray-900 text-white min-2000px:px-[.6vw] px-4 min-2000px:py-[.4vw] py-2 min-2000px:rounded-[.3vw] rounded-lg hover:ring-2 ring-main/70 duration-300"
            >
              <IoSend className="text-[18px] min-2000px:text-[.7vw]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                void start();
              }}
              aria-label={t("chat.record_voice")}
              className="cursor-pointer text-gray-500 hover:text-main duration-300 min-2000px:px-[.4vw] px-2 min-2000px:py-[.3vw] py-2"
            >
              <FaMicrophone className="text-[18px] min-2000px:text-[.75vw]" />
            </button>
          )}
        </div>
      )}

      {errorMessage && (
        <p className={clsx("min-2000px:mt-[.2vw] mt-2 min-2000px:text-[.55vw] text-[12px] text-red-400")}>
          {errorMessage}
        </p>
      )}

      <EmojiPickerModal
        isOpen={isEmojiOpen}
        onClose={() => setIsEmojiOpen(false)}
        onSelect={handleEmojiSelect}
      />
    </div>
  );
};

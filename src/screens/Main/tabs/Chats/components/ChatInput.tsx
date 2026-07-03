import { IoSend } from "react-icons/io5";
import { BsEmojiSunglasses } from "react-icons/bs";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { EmojiPickerModal } from "./EmojiPickerModal";

interface ChatInputProps {
  onSendMessage: (htmlContent: string) => void;
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
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  const getPlainTextLength = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.innerText.length;
  };

  const insertAtCursor = (html: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();

    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    range.deleteContents();

    const el = document.createElement("div");
    el.innerHTML = html;

    const frag = document.createDocumentFragment();
    let node: ChildNode | null = null;
    let lastNode: ChildNode | null = null;

    while ((node = el.firstChild)) {
      lastNode = frag.appendChild(node);
    }

    range.insertNode(frag);

    if (lastNode) {
      range.setStartAfter(lastNode);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    setMessageContent(editor.innerHTML);
  };

  const handleEmojiSelect = (emoji: any) => {
    // если обычный emoji — вставляем как текст
    if (typeof emoji.value === "string") {
      insertAtCursor(emoji.value);
      return;
    }

    // если кастомный emoji (картинка)
    if (emoji.value?.src) {
      insertAtCursor(
        `<img src="${emoji.value.src}" class="inline-block w-5 h-5 mx-[2px] align-middle" />`
      );
      return;
    }

    console.warn("Unknown emoji format:", emoji);
  };

  const handleTypingInput = (e: React.FormEvent<HTMLDivElement>) => {
    const html = e.currentTarget.innerHTML;
    const len = getPlainTextLength(html);

    if (len > MAX_LEN) {
      e.currentTarget.innerText = e.currentTarget.innerText.slice(0, MAX_LEN);
    }

    setMessageContent(html);

    if (!activeChatId) return;

    socket.emit("typing", {
      chatId: activeChatId,
      userId,
      isTyping: true,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        chatId: activeChatId,
        userId,
        isTyping: false,
      });
    }, TYPING_DELAY);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const editor = editorRef.current;
    if (!editor) return;

    const pasteText = e.clipboardData.getData("text");
    const currentTextLength = getPlainTextLength(editor.innerHTML);
    const allowed = MAX_LEN - currentTextLength;
    if (allowed <= 0) return;

    document.execCommand("insertText", false, pasteText.slice(0, allowed));
  };

  const handleSend = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const html = editor.innerHTML.trim();
    if (!html) return;

    onSendMessage(html);

    editor.innerHTML = "";
    setMessageContent("");

    if (activeChatId) {
      socket.emit("typing", {
        chatId: activeChatId,
        userId,
        isTyping: false,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="mt-auto mb-5 px-4">
      <div className="flex items-center gap-3 border dark:border-white/10 border-gray-300 rounded-xl px-3">
        <button
          onClick={() => setIsEmojiOpen(true)}
          className="text-gray-500 hover:text-main duration-300"
        >
          <BsEmojiSunglasses size={20} />
        </button>

        <div className="flex-1 relative flex items-center min-h-[44px]">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleTypingInput}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            className="dark:text-white/80 flex-1 outline-none text-[15px] py-2"
          ></div>

          {!messageContent.length && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {t("chat.type_message")}
            </span>
          )}
        </div>

        <button
          onClick={handleSend}
          className="dark:bg-white/10 bg-gray-900 text-white px-4 py-2 rounded-lg hover:ring-2 ring-main/70 duration-300"
        >
          <IoSend size={18} />
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

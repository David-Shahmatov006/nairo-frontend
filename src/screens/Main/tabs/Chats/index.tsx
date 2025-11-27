import { useRef, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { IoSearch, IoSend } from "react-icons/io5";
import clsx from "clsx";
import { MdBlockFlipped } from "react-icons/md";
import { EmojiPickerModal } from "./components/EmojiPickerModal";
import { BsEmojiSunglasses } from "react-icons/bs";
import { ConfirmModal } from "../../../../components/ConfirmModal";

const mockChats = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "",
    online: true,
    messages: [
      {
        id: 1,
        fromMe: false,
        text: "Hey! How’s your project going?",
        time: "14:20",
      },
      {
        id: 2,
        fromMe: true,
        text: "Pretty good, finishing UI now!",
        time: "14:21",
      },
      { id: 3, fromMe: false, text: "Awesome 🔥", time: "14:22" },
    ],
  },
];

export const Chats = () => {
  const [query, setQuery] = useState("");
  const [activeChat, setActiveChat] = useState(mockChats[0]);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isBlockModal, setIsBlockModal] = useState(false);
  const [message, setMessage] = useState("");

  const editorRef = useRef<HTMLDivElement>(null);

  const getPlainTextLength = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.innerText.length; // считает только текст
  };

  const MAX_LEN = 700;

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const html = e.currentTarget.innerHTML;
    const len = getPlainTextLength(html);

    if (len > MAX_LEN) {
      // Обрезаем лишнее
      e.currentTarget.innerText = e.currentTarget.innerText.slice(0, MAX_LEN);
    }

    setMessage(e.currentTarget.innerHTML);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    const editor = editorRef.current;
    if (!editor) return;

    const pasteText = e.clipboardData.getData("text");

    const currentTextLength = getPlainTextLength(editor.innerHTML);

    const allowed = MAX_LEN - currentTextLength;
    if (allowed <= 0) return;

    insertAtCursor(pasteText.slice(0, allowed));
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
    let node, lastNode;

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

    setMessage(editor.innerHTML);
  };

  const handleEmojiSelect = (emoji: any) => {
    if (emoji.type === "default") {
      insertAtCursor(emoji.value);
    } else {
      insertAtCursor(
        `<img src="${emoji.value.src}" class="inline-block w-5 h-5 mx-[2px] align-middle" />`
      );
    }
  };

  const handleSubmit = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const html = editor.innerHTML;
    if (!html.trim()) return;

    const newMsg = {
      id: Date.now(),
      fromMe: true,
      text: html,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setActiveChat((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }));

    editor.innerHTML = "";
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      if (!e.shiftKey) {
        e.preventDefault(); // запретить перенос строки
        handleSubmit(); // отправить сообщение
      }
    }
  };

  const filtered = [activeChat];

  return (
    <div className="mt-[80px] font-manrope h-full w-full flex">
      <div className="w-[30%] flex flex-col pr-4 border-r border-gray-200 pt-5">
        <div className="relative mb-4">
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg pl-10 pr-3 outline-none"
          />
        </div>

        <div className="overflow-y-auto flex-1 space-y-2">
          {filtered.map((chat) => (
            <div
              key={chat.id}
              className={clsx(
                "flex items-center justify-between p-2 rounded-lg duration-300 cursor-pointer",
                activeChat.id === chat.id ? "bg-main/10" : "hover:bg-gray-100"
              )}
            >
              <button
                onClick={() => setActiveChat(chat)}
                className="flex items-center gap-3 flex-1 text-left cursor-pointer"
              >
                <div className="w-[42px] h-[42px] rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {chat.avatar ? (
                    <img
                      src={chat.avatar}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <RxAvatar className="text-main/40 w-6 h-6" />
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 text-[15px]">
                  {chat.name}
                </h3>
              </button>

              <button
                onClick={() => setIsDeleteModal(true)}
                className="text-gray-400 hover:text-red-500 p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="h-[70px] flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-[46px] h-[46px] rounded-full bg-gray-200 flex items-center justify-center">
              <RxAvatar className="text-main/40 w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{activeChat.name}</h2>
              <p className="text-sm text-gray-500">Online now</p>
            </div>
          </div>
          <button onClick={() => setIsBlockModal(true)}>
            <MdBlockFlipped className="text-red-400 text-xl cursor-pointer" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {activeChat.messages.map((msg) => (
            <div
              key={msg.id}
              className={clsx(
                "max-w-[70%] px-5 py-3 rounded-full border",
                msg.fromMe
                  ? "ml-auto bg-main/10 border-main/10"
                  : "bg-white border-gray-200"
              )}
            >
              <div
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
              <div className="text-[11px] text-gray-500 mt-1">{msg.time}</div>
            </div>
          ))}
        </div>

        <div className="px-4 py-3 pb-10">
          <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-3">
            <button
              onClick={() => setIsEmojiOpen(true)}
              className="text-gray-500 hover:text-main cursor-pointer duration-300"
            >
              <BsEmojiSunglasses size={20} />
            </button>

            <div className="flex-1 relative flex items-center min-h-[44px]">
              <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onPaste={handlePaste}
                onKeyDown={handleKeyDown}
                className="flex-1 outline-none text-[15px] py-2"
              ></div>

              {message.length === 0 && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  Type a message…
                </span>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:ring-2 ring-main/70 cursor-pointer duration-300"
            >
              <IoSend size={18} />
            </button>
          </div>
        </div>
      </div>

      <EmojiPickerModal
        isOpen={isEmojiOpen}
        onClose={() => setIsEmojiOpen(false)}
        onSelect={handleEmojiSelect}
      />

      {/* DELETE CHAT MODAL */}
      <ConfirmModal
        isOpen={isDeleteModal}
        onClose={() => setIsDeleteModal(false)}
        onConfirm={() => {
          console.log("Chat deleted:", activeChat.id);
          setIsDeleteModal(false);
        }}
        title="Delete chat?"
        subtitle="This conversation will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ConfirmModal
        isOpen={isBlockModal}
        onClose={() => setIsBlockModal(false)}
        onConfirm={() => {
          console.log("User blocked:", activeChat.id);
          setIsBlockModal(false);
        }}
        title="Block user?"
        subtitle="This user will not be able to message you anymore."
        confirmText="Block"
        cancelText="Cancel"
      />
    </div>
  );
};

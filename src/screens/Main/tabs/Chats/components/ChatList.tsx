import clsx from "clsx";
import { IoSearch } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { AvatarImage } from "../../../../../components/AvatarImage";
import type { Chat } from "../../../../../types/chats";
import { useNavigate, useParams } from "react-router-dom";
import thinkingMuskot from "../../../../../assets/images/thinkingMuskot2.webp";
import { useState } from "react";

interface ChatListProps {
  chats: Chat[];
  setActiveChat: (chat: Chat) => void;
  onDeleteChat: (chatId: string) => void;
}

export const ChatList = ({
  chats,
  setActiveChat,
  onDeleteChat,
}: ChatListProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [query, setQuery] = useState("");

  const handleSelectChat = (chat: Chat) => {
    setActiveChat(chat);
    navigate(`/chats/${chat.id}`, { replace: true });
  };

  const filteredChats =
    query.trim().length === 0
      ? chats
      : chats.filter((c) => {
          const q = query.toLowerCase();

          const nameMatch = c.name?.toLowerCase().includes(q);
          const usernameMatch = c.username?.toLowerCase().includes(q);

          return nameMatch || usernameMatch;
        });

  return (
    <div className="max-768px:w-full w-[30%] flex flex-col pr-4 max-768px:border-none max-768px:px-3 border-r dark:border-white/10 border-gray-200 min-2000px:pt-[.8vw] pt-5">
      {chats.length > 1 && (
        <div className="relative min-2000px:mb-[.5vw] mb-4">
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 min-2000px:text-[.5vw] text-gray-500" />
          <input
            type="text"
            placeholder={t("search.title")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="dark:text-white/80 w-full min-2000px:h-[1.3vw] h-10 border dark:border-white/20 border-gray-300 min-2000px:rounded-[.3vw] rounded-lg min-2000px:pl-[1vw] pl-10 min-2000px:pr-[1vw] pr-3 outline-none min-2000px:text-[.6vw]"
          />
        </div>
      )}

      <div className="overflow-y-auto flex-1 space-y-2">
        {chats.length === 0 && (
          <p className="flex items-center justify-center h-[90%] text-gray-500 text-center min-2000px:mt-[1vw] mt-4 min-2000px:text-[.8vw]">
            {t("chat.no_chats")}
          </p>
        )}

        {chats.length !== 0 && filteredChats.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-3">
            <img src={thinkingMuskot} className="min-2000px:w-[4vw] w-[70px]" />
            <span className="min-2000px:text-[.7vw] text-[17px] text-gray-500 text-center">
              {t("chat.no_results")}
            </span>
          </div>
        )}

        {filteredChats.length > 0 &&
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={clsx(
                "flex items-center justify-between min-2000px:p-[.3vw] p-2 min-2000px:rounded-[.3vw] rounded-lg duration-300 cursor-pointer dark:hover:bg-white/3 hover:bg-gray-100",
                chatId === chat.id && "dark:bg-white/10 bg-main/10"
              )}
            >
              <button
                onClick={() => handleSelectChat(chat)}
                className="flex items-center min-2000px:gap-[.3vw] gap-3 flex-1 text-left cursor-pointer"
              >
                <div className="min-2000px:size-[1.5vw] size-[42px] rounded-full dark:bg-black bg-gray-200 flex items-center justify-center overflow-hidden">
                  <AvatarImage src={chat.avatar || ""} />
                </div>

                <h3 className="font-semibold dark:text-white/80 text-gray-900 min-2000px:text-[.6vw] text-[15px]">
                  {chat.name}
                </h3>
              </button>

              <button
                onClick={() => onDeleteChat(chat.id)}
                className="text-gray-400 hover:text-red-500 min-2000px:text-[.7vw] cursor-pointer duration-300"
              >
                ✕
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

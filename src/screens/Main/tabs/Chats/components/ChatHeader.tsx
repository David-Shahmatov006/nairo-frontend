import { AvatarImage } from "../../../../../components/AvatarImage";
import type { Chat } from "../../../../../types/chats";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../../stores/auth";
import { IoIosArrowBack } from "react-icons/io";
import { ROUTES } from "../../../../../routes";

interface ChatHeaderProps {
  activeChat: Chat;
}

export const ChatHeader = ({ activeChat }: ChatHeaderProps) => {
  const { user } = useAuthStore();
  const navigate = useNavigate()

  const receiver = activeChat.participants.find((p) => p.id !== user?.id);

  return (
    <div className="max-768px:h-[50px] max-768px:pb-2 min-2000px:h-[3vw] h-[70px] flex items-center max-768px:gap-3 min-2000px:px-[.7vw] px-4 border-b dark:border-white/10 border-gray-200">
      <button className="max-768px:block hidden" onClick={() => navigate(ROUTES.CHATS)}>
        <IoIosArrowBack className="dark:text-white/50 text-[25px]" />
      </button>
      <div className="flex items-center min-2000px:gap-[.4vw] gap-3">
        <Link to={`/user/${receiver?.id}`}>
          <div className="max-768px:size-[50px] min-2000px:size-[2vw] size-[46px] rounded-full dark:bg-black bg-gray-200 flex items-center justify-center">
            <AvatarImage src={activeChat.avatar || ""} />
          </div>
        </Link>
        <div>
          <Link to={`/user/${receiver?.id}`}>
            <h2 className="dark:hover:text-main hover:text-main duration-300 font-bold dark:text-white/80 min-2000px:text-[.7vw] text-gray-900">
              {activeChat.name}
            </h2>
          </Link>
          <p className="min-2000px:text-[.6vw] text-sm text-gray-500">{receiver?.username}</p>
        </div>
      </div>
    </div>
  );
};

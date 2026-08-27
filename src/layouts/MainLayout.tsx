import clsx from "clsx";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { PostModal } from "../screens/Main/tabs/Home/components/Posts/components/PostModal";
import { useLocation, useNavigate } from "react-router-dom";
import { Toast } from "../components/Toast";
import { ROUTES } from "../routes";
import { useAppStore } from "../stores/app";
import { useEffect } from "react";
import { useAuthStore } from "../stores/auth";
import { socket, connectSocket } from "../services/socket.service";
import type { IMessage } from "../types/chats";
import useSWR, { mutate } from "swr";
import { chatsService } from "../services/chats.service";
import { userService } from "../services/user.service";
import { pickAchievementKeys } from "../constants/achievements";

type DashboardLayoutProps = {
  children: React.ReactNode;
};
export const MainLayout = ({ children }: DashboardLayoutProps) => {
  const isOpenMessageToast = useAppStore((s) => s.isOpenMessageToast);
  const toastMessage = useAppStore((s) => s.toastMessage);
  const setToast = useAppStore((s) => s.setToast);
  const setIsOpenMessageToast = useAppStore((s) => s.setIsOpenMessageToast);
  const setChats = useAppStore((s) => s.setChats);
  const enqueueAchievementUnlocks = useAppStore(
    (s) => s.enqueueAchievementUnlocks,
  );
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const navigate = useNavigate();

  const { data: userChats, mutate: mutateUserChats } = useSWR(
    "user-chats",
    () => chatsService.getUserChats(),
  );

  useEffect(() => {
    if (!toastMessage) return;

    if (location.pathname.includes(toastMessage.chatId)) {
      setIsOpenMessageToast(false);
    }
  }, [location.pathname, toastMessage]);

  useEffect(() => {
    if (!userChats) return;

    setChats(userChats);
  }, [userChats]);

  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;
    const timeouts: number[] = [];
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    void userService
      .visit(timeZone)
      .then((data) => {
        if (cancelled) return;

        void mutate(["achievements", user.id], data.achievements, {
          revalidate: false,
        });

        const keys = pickAchievementKeys(data.newlyUnlocked);
        if (!keys.length) return;

        timeouts.push(
          window.setTimeout(() => {
            if (!cancelled) {
              enqueueAchievementUnlocks(keys);
            }
          }, 450),
        );
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, [user?.id, enqueueAchievementUnlocks]);

  useEffect(() => {
    if (!user?.id) return;

    connectSocket();

    socket.emit("connectUser", {
      userId: user.id,
    });

    const handleNotification = (message: IMessage) => {
      if (message.sender.id === user?.id) return;
      if (location.pathname.includes(message.chatId)) return;

      mutateUserChats(
        (chats) =>
          chats?.map((chat) =>
            chat.id === message.chatId
              ? { ...chat, unreadCount: chat.unreadCount + 1 }
              : chat,
          ),
        { revalidate: false },
      );

      setToast(message);
      if (message.sender.id !== user.id) setIsOpenMessageToast(true);
    };

    socket.on("newMessageNotification", handleNotification);

    return () => {
      socket.off("newMessageNotification", handleNotification);
    };
  }, [user?.id, location.pathname]);

  return (
    <>
      <div
        className={clsx(
          "dark:bg-[#0f0f0f] flex flex-col",
          location.pathname.includes("chats") && "min-[768px]:h-screen",
        )}
      >
        <Header />
        <div className="flex flex-1">
          <div className="max-1024px:hidden">
            <Sidebar />
          </div>
          <main
            className={clsx(
              "flex-1 h-full flex flex-col scrollbar-hidden max-1024px:pl-0 [@media(min-width:1024px)_and_(max-width:1339px)]:pl-[250px] min-2000px:pl-[20vw] pl-[315px] overflow-auto min-h-dvh min-2000px:pt-[3.5vw]",
              !location.pathname.includes("/chats") &&
              "max-1024px:!px-[16px] [@media(min-width:1024px)_and_(max-width:1339px)]:pr-[0px] max-768px:pt-[80px] min-2000px:pt-[6vw] pt-[116px] max-768px:pb-10 pb-[100px] min-2000px:pr-[7vw] pr-[100px]",
            )}
          >
            {children}
          </main>
        </div>
      </div>
      <PostModal />
      {toastMessage && (
        <Toast
          open={isOpenMessageToast}
          message={toastMessage}
          onClose={() => setIsOpenMessageToast(false)}
          onOpenChat={() => {
            setIsOpenMessageToast(false);
            navigate(`${ROUTES.CHATS}/${toastMessage.chatId}`);
          }}
        />
      )}
    </>
  );
};

import { useEffect, useState } from "react";
import { IoIosMenu } from "react-icons/io";
import { LuSun, LuMoon } from "react-icons/lu";
import { IoAddOutline } from "react-icons/io5";
import { Logo } from "../Logo";
import { UserDropdown } from "./components/UserDropdown";
import { useAppStore } from "../../stores/app";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getSidebarTabs } from "../../utils/getSidebarTabs";
import { Link, useParams } from "react-router-dom";
import clsx from "clsx";
import { ROUTES } from "../../routes";
import { TfiClose } from "react-icons/tfi";
import { FiLogOut } from "react-icons/fi";
import { useAuthStore } from "../../stores/auth";
import { AvatarImage } from "../AvatarImage";
import { useIsMobile } from "../../hooks/useIsMobile";

export const Header = () => {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const openCreatePostModal = useAppStore((s) => s.openCreatePostModal);
  const postModal = useAppStore((s) => s.postModal);
  const chats = useAppStore((s) => s.chats);
  const { t } = useTranslation();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const { chatId: chatIdFromUrl } = useParams();
  const isMobile = useIsMobile();
  const unreadCount = chats?.reduce(
    (sum, chat) => sum + (chat.unreadCount ?? 0),
    0,
  );

  const tabs = getSidebarTabs(t);
  const isActiveRoute = (route: string) => {
    if (route === ROUTES.PROFILE) {
      return location.pathname.startsWith("/profile");
    }
    return location.pathname === route;
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    !(isMobile && chatIdFromUrl) && (
      <header className="dark:bg-[#191a1a] z-[50] fixed top-0 left-0 w-full flex items-center justify-between bg-white min-2000px:px-[2vw] px-4 min-2000px:py-[0.7vw] py-3 md:px-8 md:py-4 dark:border-white/10 border-b border-[#E5E7EB]">
        <Logo />

        <div className="max-1024px:hidden flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="
              flex items-center justify-center min-2000px:size-[3vw] size-[48px]
              min-2000px:rounded-[0.5vw] rounded-lg border border-gray-300 dark:border-[gray]/50
              bg-white dark:bg-[#1a1a1a]
              hover:ring-2 ring-main/70
              duration-300 cursor-pointer
            "
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <LuMoon className="min-2000px:text-[1.5vw] text-[22px] text-main" />
            ) : (
              <LuSun className="min-2000px:text-[1.5vw] text-[22px] text-main" />
            )}
          </button>

          <button
            onClick={() => openCreatePostModal(postModal.mode)}
            className="
            flex items-center justify-center min-2000px:size-[3vw] size-[48px]
            min-2000px:rounded-[0.5vw] rounded-lg border border-gray-300 dark:border-[gray]/50
            bg-white dark:bg-[#1a1a1a]
            duration-300 hover:ring-2 ring-main/70
            cursor-pointer
          "
            aria-label="Create post"
          >
            <IoAddOutline className="min-2000px:text-[1.7vw] text-[25px] text-main" />
          </button>

          <UserDropdown />
        </div>

        <div className="max-1024px:flex hidden items-center gap-2">
          <button
            onClick={() => openCreatePostModal(postModal.mode)}
            className="
            flex items-center justify-center size-[42px]
            rounded-lg border border-gray-300 dark:border-white/10
            bg-white dark:bg-[#1a1a1a]
            hover:ring-2 ring-main/70 duration-300 cursor-pointer
          "
            aria-label="Create post"
          >
            <IoAddOutline className="text-[22px] text-main" />
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="
            flex items-center justify-center size-[42px]
            rounded-lg border border-gray-300 dark:border-white/10
            bg-white dark:bg-[#1a1a1a]
            hover:ring-2 ring-main/70 duration-300 cursor-pointer
          "
            aria-label="Open menu"
          >
            <IoIosMenu className="text-[22px] text-main" />
          </button>
        </div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 200, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                className="
              absolute right-0 top-0 h-full w-[90%]
              bg-white dark:bg-[#141418]
              border-l border-black/10 dark:border-white/10
              p-4 flex flex-col justify-between
              shadow-[0_8px_40px_-8px_rgba(0,0,0,0.35)]
            "
              >
                <div className="pb-5 border-b border-black/15 dark:border-white/15">
                  <div className="flex items-center justify-between">
                    <Logo />

                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="z-[2] absolute dark:bg-[#191a1a] bg-[#FFFFFF] border flex items-center justify-center dark:border-white/20 border-[#E5E7EB] rounded-[12px] max-768px:size-9 size-10 max-768px:top-4 top-[32px] max-768px:right-4 right-[32px] cursor-pointer hover:ring-2 hover:ring-main/50  duration-300"
                    >
                      <TfiClose className="dark:text-white max-768px:text-[14px]" />
                    </button>
                  </div>

                  <div className="mt-10 flex flex-col gap-3">
                    {tabs.map(({ icon: Icon, label, route }, idx) => {
                      const active = isActiveRoute(route);

                      return (
                        <Link to={route} key={idx}>
                          <motion.button
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ type: "spring", delay: idx * 0.1 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={clsx(
                              "w-full dark:text-[#f9f5e8] flex items-center p-3 rounded-[12px] gap-4 mt-2 cursor-pointer",

                              active &&
                                "dark:bg-white/10 bg-white border dark:border-white/20 border-[#E5E7EB] shadow-sm",
                            )}
                          >
                            <Icon className="scale-150" />
                            <span className="font-manrope">{label}</span>
                            {idx === 2 && unreadCount > 0 && (
                              <span className="size-5 flex items-center justify-center bg-main/70 text-white text-[14px] rounded-full">
                                {unreadCount}
                              </span>
                            )}
                          </motion.button>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="flex items-center justify-between gap-3 mb-7"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 shrink-0">
                      <AvatarImage src={user?.avatar || ""} />
                    </div>
                    <div className="flex flex-col max-w-[40vw]">
                      <span className="dark:text-white truncate">
                        {user?.firstName} {user?.lastName}
                      </span>
                      <span className="text-[14px] dark:text-white/25 text-black/50">
                        @{user?.username}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleTheme}
                      className="size-9 rounded-lg flex items-center justify-center bg-main/15"
                    >
                      {theme === "dark" ? (
                        <LuSun className="text-main" />
                      ) : (
                        <LuMoon className="text-main" />
                      )}
                    </button>

                    <button
                      onClick={logout}
                      className="size-9 rounded-lg flex items-center justify-center bg-[red]/20"
                    >
                      <FiLogOut className="text-[red]/70" />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    )
  );
};

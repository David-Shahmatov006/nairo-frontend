import { GoHome } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import { type IconType } from "react-icons";
import clsx from "clsx";
import { IoBookmarkOutline, IoSettingsOutline } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { useTranslation } from "react-i18next";
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../routes";

export const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const tabs: { icon: IconType; label: string; route: string }[] = [
    { icon: GoHome, label: t("sidebar.home"), route: ROUTES.HOME },
    { icon: IoIosSearch, label: t("sidebar.search"), route: ROUTES.SEARCH },
    {
      icon: HiOutlineChatBubbleOvalLeft,
      label: t("sidebar.chats"),
      route: ROUTES.CHATS,
    },
    { icon: IoBookmarkOutline, label: t("sidebar.saved"), route: ROUTES.SAVED },

    { icon: RxAvatar, label: t("sidebar.profile"), route: ROUTES.PROFILE }, 

    { icon: IoSettingsOutline, label: t("sidebar.settings"), route: ROUTES.SETTINGS },
  ];

  const isActiveRoute = (route: string) => {
    if (route === ROUTES.PROFILE) {
      return location.pathname.startsWith("/profile") || location.pathname.startsWith("/user/");
    }
    return location.pathname === route;
  };

  return (
    <aside className="fixed top-0 left-0 flex flex-col w-[285px] dark:bg-black bg-[#F3F4F6] h-screen dark:border-white/20 border-r border-[#E5E7EB] pt-[150px] pl-4 pr-4 gap-3 z-[2]">
      {tabs.map(({ icon: Icon, label, route }, idx) => {
        
        const active = isActiveRoute(route);

        return (
          <Link to={route} key={idx}>
            <button
              className={clsx(
                "w-full dark:text-[#f9f5e8] flex items-center p-3 rounded-[12px] gap-4 mt-2 cursor-pointer",

                active &&
                  "dark:bg-white/10 bg-white border dark:border-white/20 border-[#E5E7EB] shadow-sm"
              )}
            >
              <Icon className="scale-150" />
              <span className="font-manrope">{label}</span>
            </button>
          </Link>
        );
      })}
    </aside>
  );
};

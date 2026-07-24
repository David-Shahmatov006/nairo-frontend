import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../routes";
import { getSidebarTabs } from "../../utils/getSidebarTabs";

export const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const tabs = getSidebarTabs(t);

  const isActiveRoute = (route: string) => {
    if (route === ROUTES.PROFILE) {
      return location.pathname.startsWith("/profile");
    }
    if (route === ROUTES.CHATS) {
      return location.pathname.includes('/chats')
    }
    return location.pathname === route;
  };

  return (
    <aside className="fixed top-0 left-0 flex flex-col [@media(min-width:1024px)_and_(max-width:1339px)]:w-[240px] min-2000px:w-[19vw] w-[285px] dark:bg-black bg-[#F3F4F6] h-screen dark:border-white/20 border-r border-[#E5E7EB] min-2000px:pt-[8vw] pt-[150px] min-2000px:px-[1vw] px-4 min-2000px:gap-[1vw] gap-3 z-[2]">
      {tabs.map(({ icon: Icon, label, route }, idx) => {
        const active = isActiveRoute(route);

        return (
          <Link to={route} key={idx}>
            <button
              className={clsx(
                "w-full dark:text-[#f9f5e8] flex items-center min-2000px:p-[0.6vw] p-3 min-2000px:rounded-[.7vw] rounded-[12px] min-2000px:gap-[1vw] gap-4 mt-2 cursor-pointer",

                active &&
                  "dark:bg-white/10 bg-white border dark:border-white/20 border-[#E5E7EB] shadow-sm",
              )}
            >
              <div>
                <Icon className="scale-150 min-2000px:text-[0.9vw]" />
              </div>
              <span className="[@media(min-width:1024px)_and_(max-width:1339px)]:text-[14px] font-manrope min-2000px:text-[0.9vw]">{label}</span>
            </button>
          </Link>
        );
      })}
    </aside>
  );
};

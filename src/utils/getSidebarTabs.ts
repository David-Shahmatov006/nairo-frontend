import type { IconType } from "react-icons";
import { GoHome } from "react-icons/go";
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";
import { IoBookmarkOutline, IoSettingsOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { RxAvatar } from "react-icons/rx";
import { ROUTES } from "../routes";

export interface SidebarTab {
  icon: IconType;
  label: string;
  route: string;
}

export const getSidebarTabs = (
  t: (key: string) => string,
): SidebarTab[] => [
  {
    icon: GoHome,
    label: t("sidebar.home"),
    route: ROUTES.HOME,
  },
  {
    icon: IoIosSearch,
    label: t("sidebar.search"),
    route: ROUTES.SEARCH,
  },
  {
    icon: HiOutlineChatBubbleOvalLeft,
    label: t("sidebar.chats"),
    route: ROUTES.CHATS,
  },
  {
    icon: IoBookmarkOutline,
    label: t("sidebar.saved"),
    route: ROUTES.SAVED,
  },
  {
    icon: RxAvatar,
    label: t("sidebar.profile"),
    route: ROUTES.PROFILE,
  },
  {
    icon: IoSettingsOutline,
    label: t("sidebar.settings"),
    route: ROUTES.SETTINGS,
  },
];
import { GoHome } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import { type IconType } from "react-icons";
import clsx from "clsx";
import { IoBookmarkOutline, IoSettingsOutline } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../../stores/app";
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";

export const Sidebar = () => {
  const { t } = useTranslation();
  const { activeTab, setActiveTab } = useAppStore();

  const tabs: { icon: IconType; label: string; key: string }[] = [
    { icon: GoHome, label: t("sidebar.home"), key: "home" },
    { icon: IoIosSearch, label: t("sidebar.search"), key: "searchMembers" },
    { icon: IoBookmarkOutline, label: t("sidebar.saved"), key: "saved" },
    { icon: RxAvatar, label: t("sidebar.profile"), key: "profile" },
    { icon: IoSettingsOutline, label: t("sidebar.settings"), key: "settings" },
    { icon: HiOutlineChatBubbleOvalLeft , label: t("sidebar.chats"), key: "chats" },
  ];

  const handleTabClick = (idx: number) => {
    setActiveTab(idx);
    localStorage.setItem("activeTab", idx.toString());
  };
  return (
    <aside className="fixed top-0 left-0 flex flex-col w-[285px] bg-[#F3F4F6] h-screen border-r border-[#E5E7EB] pt-[150px] pl-4 pr-4 gap-3 z-[2]">
      {tabs.map(({ icon: Icon, label }, idx) => (
        <button
          key={label}
          onClick={() => handleTabClick(idx)}
          className={clsx(
            "flex items-center p-3 rounded-[12px] gap-4 mt-2 cursor-pointer",
            activeTab === idx && "bg-white border border-[#E5E7EB] shadow-sm"
          )}
        >
          <Icon className="scale-150" />
          <span className="font-manrope">{label}</span>
        </button>
      ))}
    </aside>
  );
};

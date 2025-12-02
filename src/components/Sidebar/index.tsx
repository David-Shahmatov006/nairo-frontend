import { GoHome } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import { type IconType } from "react-icons";
import clsx from "clsx";
import { IoBookmarkOutline, IoSettingsOutline } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../../stores/app";
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth";

export const Sidebar = () => {
  const { t } = useTranslation();
  const { activeTab, setActiveTab } = useAppStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const tabs: { icon: IconType; label: string; key: string }[] = [
    { icon: GoHome, label: t("sidebar.home"), key: "home" },
    { icon: IoIosSearch, label: t("sidebar.search"), key: "searchMembers" },
    { icon: HiOutlineChatBubbleOvalLeft, label: t("sidebar.chats"), key: "chats" },
    { icon: IoBookmarkOutline, label: t("sidebar.saved"), key: "saved" },
    { icon: RxAvatar, label: t("sidebar.profile"), key: "profile" },
    { icon: IoSettingsOutline, label: t("sidebar.settings"), key: "settings" },
  ];

  const handleTabClick = (idx: number, key: string) => {
    setActiveTab(idx);
    localStorage.setItem("activeTab", idx.toString());

    if (key === "profile" && user?.id) {
      navigate(`/user/${user.id}`);
      return;
    }
  };

  return (
    <aside className="fixed top-0 left-0 flex flex-col w-[285px] dark:bg-black bg-[#F3F4F6] h-screen dark:border-white/20 border-r border-[#E5E7EB] pt-[150px] pl-4 pr-4 gap-3 z-[2]">
      {tabs.map(({ icon: Icon, label, key }, idx) => (
        <button
          key={key}
          onClick={() => handleTabClick(idx, key)}
          className={clsx(
            "dark:text-[#f9f5e8] flex items-center p-3 rounded-[12px] gap-4 mt-2 cursor-pointer",
            activeTab === idx &&
              "dark:bg-white/10 bg-white border dark:border-white/20 border-[#E5E7EB] shadow-sm"
          )}
        >
          <Icon className="scale-150" />
          <span className="font-manrope">{label}</span>
        </button>
      ))}
    </aside>
  );
};

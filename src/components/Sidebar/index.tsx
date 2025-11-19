import { useState } from "react";
import { GoHome } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import { type IconType } from "react-icons";
import clsx from "clsx";
import { IoBookmarkOutline } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";

const tabs: { icon: IconType; label: string }[] = [
  { icon: GoHome, label: "Home" },
  { icon: IoIosSearch, label: "Search" },
  { icon: IoBookmarkOutline, label: "Saved" },
  { icon: RxAvatar, label: "Profile" },
];

export const Sidebar = () => {
  const [selected, setSelected] = useState<string>("Home");

  return (
    <aside className="fixed top-0 left-0 flex flex-col w-[195px] bg-[#F3F4F6] h-screen border-r border-[#E5E7EB] pt-[150px] pl-4 pr-4 gap-3">
      {tabs.map(({ icon: Icon, label }) => (
        <button
          key={label}
          onClick={() => setSelected(label)}
          className={clsx(
            "flex items-center p-3 rounded-[12px] gap-4 mt-2 cursor-pointer",
            selected === label &&
              "bg-white border border-[#E5E7EB] shadow-sm"
          )}
        >
          <Icon className="scale-150" />
          <span className="font-manrope">{label}</span>
        </button>
      ))}
    </aside>
  );
};

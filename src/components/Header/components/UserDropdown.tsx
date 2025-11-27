import { useState, useEffect, useRef } from "react";
import { RxAvatar } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../../stores/app";
import { useTranslation } from "react-i18next";

export const UserDropdown = () => {
  const { setActiveTab } = useAppStore();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const user = {
    firstName: "David",
    lastName: "Shahmatov",
    username: "david_sh",
    avatar: "",
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="font-manrope relative" ref={ref}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="min-w-[150px] h-[48px] border border-gray-300 px-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-gray-50 duration-200"
      >
        <div className="size-7 bg-main/10 rounded-full flex items-center justify-center overflow-hidden">
          {user.avatar ? (
            <img src={user.avatar} alt="avatar" className="w-full h-full" />
          ) : (
            <RxAvatar className="size-[28px] text-[#8b53ff]" />
          )}
        </div>

        <span className="font-manrope whitespace-nowrap">
          {user.firstName} {user.lastName}
        </span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-[230px] bg-white shadow-lg rounded-xl border border-gray-200 p-4 z-50"
          >
            <div className="flex items-center gap-[10px] pb-3 mb-3 border-b border-gray-200">
              <div className="rounded-full bg-main/10 flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" />
                ) : (
                  <RxAvatar className="size-8 text-[#8b53ff]" />
                )}
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-gray-500 text-sm">@{user.username}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setOpen(false);
                setActiveTab(4);
              }}
              className="w-full cursor-pointer text-left py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded-md duration-300"
            >
              <span>{t("sidebar.settings")}</span>
            </button>

            <button className="w-full text-left py-2 cursor-pointer px-3 text-sm text-red-600 hover:bg-red-50 rounded-md duration-300">
              <span>{t("settings.logout")}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

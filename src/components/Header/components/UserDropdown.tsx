import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../stores/auth";
import { AvatarImage } from "../../AvatarImage";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes";

export const UserDropdown = () => {
  const { logout, user } = useAuthStore();
  const { t } = useTranslation();
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        className="min-w-[150px] h-[48px] border dark:border-[gray]/50 dark:hover:bg-black/20 border-gray-300 px-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-gray-50 duration-200"
      >
        <div className="size-9 bg-main/10 rounded-full flex items-center justify-center overflow-hidden">
          <AvatarImage
            src={user?.avatar || ""}
          />
        </div>

        <span className="dark:text-[#f9f5e8] font-manrope whitespace-nowrap">
          {user?.firstName} {user?.lastName}
        </span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-[230px] dark:bg-[#191a1a] bg-white shadow-lg rounded-xl border dark:border-white/20 border-gray-200 p-4 z-50"
          >
            <div className="flex items-center gap-[10px] pb-3 mb-3 border-b dark:border-white/20 border-gray-200">
              <div className="size-10 rounded-full bg-main/10 flex items-center justify-center overflow-hidden">
                <AvatarImage
                  src={user?.avatar || ""}
                />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium dark:text-[#f9f5e8] text-gray-800">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-gray-500 text-sm">@{user?.username}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setOpen(false);
                navigate(ROUTES.SETTINGS)
              }}
              className="w-full cursor-pointer text-left py-2 px-3 text-sm dark:text-[#f9f5e8]/50 text-gray-700 dark:hover:bg-white/10 hover:bg-gray-100 rounded-md duration-300"
            >
              <span>{t("sidebar.settings")}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                logout();
              }}
              className="w-full text-left py-2 cursor-pointer px-3 text-sm text-red-600 dark:hover:bg-white/10 hover:bg-red-50 rounded-md duration-300"
            >
              <span>{t("settings.logout")}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

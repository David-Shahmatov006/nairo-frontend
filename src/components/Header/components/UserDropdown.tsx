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
  const navigate = useNavigate();
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
    <div
      className="w-[max-content] min-2000px:max-w-[13vw] max-w-[220px] font-manrope relative z-[999]"
      ref={ref}
    >
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="min-2000px:h-[3vw] h-[48px] border dark:border-[gray]/50 dark:hover:bg-black/20 border-gray-300 min-2000px:px-[0.7vw] px-2 min-2000px:rounded-[.5vw] rounded-lg flex items-center min-2000px:gap-[0.5vw] gap-2 cursor-pointer hover:bg-gray-50 duration-200 z-[999]"
      >
        <div className="min-2000px:size-[2vw] size-9 bg-main/10 rounded-full flex items-center justify-center overflow-hidden shrink-0">
          <AvatarImage src={user?.avatar || ""} />
        </div>

        <span className="min-2000px:text-[1vw] dark:text-[#f9f5e8] font-manrope whitespace-nowrap truncate min-w-0">
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
            className="absolute right-0 mt-2 min-2000px:w-[12.8vw] w-[230px] dark:bg-[#191a1a] bg-white shadow-lg rounded-xl border dark:border-white/20 border-gray-200 min-2000px:p-[.5vw] p-4 z-50"
          >
            <div className="flex items-center gap-[10px] min-2000px:pb-[.4vw] pb-3 min-2000px:mb-[.3vw] mb-3 border-b dark:border-white/20 border-gray-200">
              <div className="min-2000px:size-[1.8vw] size-10 rounded-full bg-main/10 flex items-center justify-center overflow-hidden shrink-0">
                <AvatarImage src={user?.avatar || ""} />
              </div>

              <div className="flex flex-col max-w-[73%]">
                <span className="min-2000px:text-[.7vw] text-sm font-medium dark:text-[#f9f5e8] text-gray-800 truncate">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-gray-500 min-2000px:text-[.6vw] text-sm">
                  @{user?.username}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setOpen(false);
                navigate(ROUTES.SETTINGS);
              }}
              className="w-full cursor-pointer text-left min-2000px:py-[.2vw] min-2000px:py-[.2vw] py-2 min-2000px:px-[.3vw] px-3 min-2000px:text-[.6vw] text-sm dark:text-[#f9f5e8]/50 text-gray-700 dark:hover:bg-white/10 hover:bg-gray-100 min-2000px:rounded-[.3vw] rounded-md duration-300"
            >
              <span>{t("sidebar.settings")}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                logout();
              }}
              className="w-full cursor-pointer text-left min-2000px:py-[.2vw] min-2000px:py-[.2vw] py-2 min-2000px:px-[.3vw] px-3 min-2000px:text-[.6vw] text-sm dark:text-red-400 text-red-600 dark:hover:bg-white/10 hover:bg-red-50 min-2000px:rounded-[.3vw] rounded-md duration-300"
            >
              <span>{t("settings.logout")}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosArrowDown, IoMdCheckmark } from "react-icons/io";
import clsx from "clsx";
import { useAppStore } from "../../../../../../stores/app";
import { useAuthStore } from "../../../../../../stores/auth";
import { LANGS } from "../../../../../../constants/langs";
import { userService } from "../../../../../../services/user.service";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../../../../../../routes";

export const LanguageSelector = () => {
  const [open, setOpen] = useState(false);
  const { selectedLanguage, setSelectedLanguage } = useAppStore();
  const { user, updateUser } = useAuthStore();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const isAuthPage = pathname.includes(ROUTES.LOGIN);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = async (code: string) => {
    const lang = LANGS.find((l) => l.code === code);
    if (!lang) return;

    setSelectedLanguage(lang);
    i18n.changeLanguage(code);
    localStorage.setItem("language", code);

    if (isAuthPage) return;
    try {
      await userService.changeLanguage(code);

      updateUser({
        ...user,
        preferredLanguage: code,
      });

      setOpen(false);
    } catch (err) {
      console.error("Language update error", err);
    }
  };

  return (
    <div
      ref={rootRef}
      className="z-[1] h-[max-content] relative flex justify-end text-left"
    >
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={clsx(
          "min-2000px:w-[10vw] w-[150px] flex items-center justify-between min-2000px:px-[.3vw] px-3 max-1024px:py-1 min-2000px:py-[.2vw] py-1.5 dark:bg-[#272727] bg-white border dark:border-white/10 border-gray-200 min-2000px:rounded-[.4vw] rounded-md shadow-sm cursor-pointer duration-300",
          !open && "hover:ring-2 hover:ring-main/70 ",
        )}
      >
        <div className="flex items-center min-2000px:gap-[.4vw] gap-2">
          <span className="min-2000px:text-[1vw] text-lg">{selectedLanguage?.flag}</span>
          <span className="dark:text-white/80 min-2000px:text-[.75vw] text-sm font-medium">
            {selectedLanguage?.label}
          </span>
        </div>
        <IoIosArrowDown
          className={clsx(
            "min-2000px:text-[.8vw] dark:text-white/80 duration-300",
            open && "rotate-[180deg]",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 max-1024px:mt-10 min-2000px:mt-[2.3vw] mt-[30%] min-2000px:w-[10vw] w-[150px] dark:bg-[#272727] bg-white border dark:border-white/10 border-gray-200 min-2000px:rounded-[.3vw] rounded-md shadow-lg z-[999] overflow-hidden"
          >
            <div className="min-2000px:py-[.2vw] py-1 max-h-[27vh] overflow-y-auto custom-scrollbar">
              {LANGS.map((lang, idx) => {
                const active = lang.code === selectedLanguage?.code;

                return (
                  <div
                    key={idx}
                    onClick={() => handleChange(lang.code)}
                    className={clsx(
                      "cursor-pointer w-full text-left flex items-center min-2000px:gap-[.3vw] gap-3 min-2000px:px-[.3vw] px-3 min-2000px:py-[.2vw] py-2 min-2000px:text-[.7vw] text-sm dark:hover:bg-white/10 hover:bg-gray-50 transition",
                      active && "dark:bg-white/20 bg-gray-100 font-semibold",
                    )}
                  >
                    <span className="min-2000px:text-[.7vw] text-lg">{lang.flag}</span>
                    <span className="flex-1 dark:text-white/80">
                      {lang.label}
                    </span>

                    {active && (
                      <div>
                        <IoMdCheckmark className="dark:text-white/80" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

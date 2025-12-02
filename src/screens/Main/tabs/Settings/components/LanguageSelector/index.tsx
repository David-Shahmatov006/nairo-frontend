import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosArrowDown, IoMdCheckmark } from "react-icons/io";
import clsx from "clsx";
import { useAppStore } from "../../../../../../stores/app";
import { useAuthStore } from "../../../../../../stores/auth";
import { LANGS } from "../../../../../../constants/langs";
import { userService } from "../../../../../../services/user.service";

export const LanguageSelector = () => {
  const [open, setOpen] = useState(false);
  const { selectedLanguage, setSelectedLanguage } = useAppStore();
  const { user, updateUser } = useAuthStore();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { i18n } = useTranslation();

  const handleChange = async (code: string) => {
    const lang = LANGS.find((l) => l.code === code);
    if (!lang) return;

    try {
      // 1. отправляем на backend
      await userService.changeLanguage(code);

      // 2. обновляем локально
      setSelectedLanguage(lang);
      i18n.changeLanguage(code);
      localStorage.setItem("language", code);

      // 3. обновляем юзера в сторе (если нужно)
      updateUser({
        ...user,
        preferredLanguage: code,
      });

      // 4. закрываем меню
      setOpen(false);
    } catch (err) {
      console.error("Language update error", err);
    }
  };

  return (
    <div
      ref={rootRef}
      className="h-[max-content] relative flex justify-end text-left"
    >
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={clsx(
          "w-[150px] flex items-center justify-between px-3 py-1.5 dark:bg-white/10 bg-white border dark:border-white/10 border-gray-200 rounded-md shadow-sm cursor-pointer duration-300",
          !open && "hover:ring-2 hover:ring-main/70 "
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{selectedLanguage?.flag}</span>
          <span className="dark:text-white/80 text-sm font-medium hidden sm:inline">
            {selectedLanguage?.label}
          </span>
        </div>
        <IoIosArrowDown
          className={clsx("dark:text-white/80 duration-300", open && "rotate-[180deg]")}
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
            className="absolute right-0 mt-[30%] w-[150px] dark:bg-white/10 bg-white border dark:border-white/10 border-gray-200 rounded-md shadow-lg z-20 overflow-hidden"
          >
            <div className="py-1">
              {LANGS.map((lang, idx) => {
                const active = lang.code === selectedLanguage?.code;

                return (
                  <div
                    key={idx}
                    onClick={() => handleChange(lang.code)}
                    className={clsx(
                      "cursor-pointer w-full text-left flex items-center gap-3 px-3 py-2 text-sm dark:hover:bg-white/10 hover:bg-gray-50 transition",
                      active && "dark:bg-white/20 bg-gray-100 font-semibold"
                    )}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="flex-1 dark:text-white/80">{lang.label}</span>

                    {active && (
                      <IoMdCheckmark className="dark:text-white/80" />
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

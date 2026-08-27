import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosClose } from "react-icons/io";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import type { Achievement } from "../../../../../../types/achievements";

interface IProps {
  open: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

export const AchievementsModal = ({ open, onClose, achievements }: IProps) => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const unlockedCount = achievements.filter((item) => item.unlocked).length;
  const displayedKey = open ? activeKey : null;

  const handleClose = () => {
    setActiveKey(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="font-manrope fixed inset-0 bg-black/40 backdrop-blur-[7px] z-[999] flex items-center justify-center min-2000px:px-[.5vw] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="dark:bg-[#191a1a] bg-white w-full min-2000px:max-w-[28vw] max-w-[520px] min-2000px:rounded-[.5vw] rounded-2xl min-2000px:p-[.7vw] p-6 shadow-xl"
          >
            <div className="flex items-center justify-between min-2000px:mb-[.6vw] mb-5">
              <div>
                <h2 className="min-2000px:text-[.9vw] text-[20px] font-[700] dark:text-white/80 text-gray-900">
                  {t("achievements.title")}
                </h2>
                <p className="min-2000px:text-[.65vw] text-sm dark:text-white/40 text-gray-500">
                  {unlockedCount}/{achievements.length}
                </p>
              </div>
              <button type="button" onClick={handleClose}>
                <IoIosClose className="min-2000px:size-[1.1vw] size-7 rounded-full dark:bg-white/10 dark:text-white/80 bg-gray-200 flex items-center justify-center hover:ring-2 ring-main/70 cursor-pointer duration-300" />
              </button>
            </div>

            <div className="grid grid-cols-3 min-2000px:gap-[.6vw] gap-4">
              {achievements.map((achievement) => {
                const isActive = displayedKey === achievement.key;

                return (
                  <button
                    type="button"
                    key={achievement.key}
                    onClick={() =>
                      setActiveKey((prev) =>
                        prev === achievement.key ? null : achievement.key,
                      )
                    }
                    onMouseEnter={() => setActiveKey(achievement.key)}
                    onMouseLeave={() => setActiveKey(null)}
                    className="group relative flex flex-col items-center min-2000px:gap-[.25vw] gap-2 cursor-pointer"
                  >
                    <div className="min-2000px:size-[4.2vw] size-20 rounded-full overflow-hidden duration-300 dark:bg-white/10 bg-gray-200">
                      {achievement.unlocked && (
                        <img
                          src={achievement.icon}
                          alt={t(`achievements.${achievement.key}_name`)}
                          draggable={false}
                          className="size-full object-cover"
                        />
                      )}
                    </div>
                    <span
                      className={clsx(
                        "min-2000px:text-[.6vw] text-[12px] font-medium text-center leading-[130%]",
                        achievement.unlocked
                          ? "dark:text-white/80 text-gray-800"
                          : "dark:text-white/30 text-gray-400",
                      )}
                    >
                      {t(`achievements.${achievement.key}_name`)}
                    </span>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-10 w-max min-2000px:max-w-[10vw] max-w-[160px] dark:bg-[#272727] bg-gray-900 text-white min-2000px:rounded-[.3vw] rounded-lg min-2000px:px-[.4vw] px-3 min-2000px:py-[.25vw] py-2 pointer-events-none"
                        >
                          <p className="min-2000px:text-[.55vw] text-[11px] leading-[140%] text-center">
                            {t(`achievements.${achievement.key}_description`)}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

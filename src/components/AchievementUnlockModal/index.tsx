import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { IoIosClose } from "react-icons/io";
import { useAppStore } from "../../stores/app";
import { ACHIEVEMENT_ICONS } from "../../constants/achievements";

const PARTICLES = Array.from({ length: 22 }, (_, index) => {
  const angle = (index / 22) * Math.PI * 2;
  const distance = 92 + (index % 5) * 22;

  return {
    id: index,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    size: 5 + (index % 4) * 2,
    delay: index * 0.025,
    color:
      index % 3 === 0
        ? "#fbbf24"
        : index % 3 === 1
          ? "#8b53ff"
          : "#ffffff",
  };
});

export const AchievementUnlockModal = () => {
  const { t } = useTranslation();
  const queue = useAppStore((s) => s.achievementUnlockQueue);
  const dismiss = useAppStore((s) => s.dismissAchievementUnlock);
  const currentKey = queue[0];
  const current = useMemo(
    () =>
      currentKey
        ? {
            key: currentKey,
            icon: ACHIEVEMENT_ICONS[currentKey],
          }
        : null,
    [currentKey],
  );

  useEffect(() => {
    if (!current) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismiss();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [current, dismiss]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence mode="wait">
      {current && (
        <motion.div
          key={current.key}
          className="font-manrope fixed inset-0 z-[10000] flex items-center justify-center min-2000px:px-[.5vw] px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="achievement-unlock-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismiss}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[10px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,83,255,0.28),transparent_62%)]" />

          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.82, opacity: 0, y: 28 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="relative w-full min-2000px:max-w-[24vw] max-w-[420px] dark:bg-[#191a1a] bg-white min-2000px:rounded-[.8vw] rounded-3xl min-2000px:p-[1vw] p-8 shadow-[0_24px_80px_rgba(139,83,255,0.28)] text-center"
          >
            <button
              type="button"
              onClick={dismiss}
              className="absolute min-2000px:top-[.6vw] top-4 min-2000px:right-[.6vw] right-4"
            >
              <IoIosClose className="min-2000px:size-[1.1vw] size-7 rounded-full dark:bg-white/10 dark:text-white/80 bg-gray-200 flex items-center justify-center hover:ring-2 ring-main/70 cursor-pointer duration-300" />
            </button>

            <div className="relative flex items-center justify-center min-2000px:h-[9vw] h-44 min-2000px:mb-[.6vw] mb-5">
              {PARTICLES.map((particle) => (
                <motion.span
                  key={particle.id}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: particle.size,
                    height: particle.size,
                    backgroundColor: particle.color,
                    boxShadow: `0 0 10px ${particle.color}`,
                  }}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: particle.x,
                    y: particle.y,
                    scale: [0.4, 1, 0.2],
                  }}
                  transition={{
                    duration: 1.15,
                    delay: 0.12 + particle.delay,
                    ease: "easeOut",
                  }}
                />
              ))}

              <motion.div
                className="absolute min-2000px:size-[7.2vw] size-[132px] rounded-full border-2 border-dashed border-main/50"
                animate={{ rotate: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              />

              <motion.div
                initial={{ scale: 0.35, rotate: -12, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 16,
                  delay: 0.08,
                }}
                className="relative min-2000px:size-[6vw] size-28 rounded-full overflow-hidden ring-4 ring-main/40 shadow-[0_0_40px_rgba(139,83,255,0.55)]"
              >
                <img
                  src={current.icon}
                  alt={t(`achievements.${current.key}_name`)}
                  draggable={false}
                  className="size-full object-cover"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  initial={{ x: "-130%" }}
                  animate={{ x: "130%" }}
                  transition={{ delay: 0.45, duration: 0.85, ease: "easeOut" }}
                />
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="min-2000px:text-[.7vw] text-sm font-semibold tracking-[0.14em] uppercase text-main min-2000px:mb-[.25vw] mb-2"
            >
              {t("achievements.unlocked")}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36 }}
              id="achievement-unlock-title"
              className="min-2000px:text-[1.15vw] text-[24px] font-[800] dark:text-white text-gray-900 min-2000px:mb-[.25vw] mb-2"
            >
              {t(`achievements.${current.key}_name`)}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44 }}
              className="min-2000px:text-[.7vw] text-[14px] leading-[150%] dark:text-white/55 text-gray-500 min-2000px:mb-[.8vw] mb-6"
            >
              {t(`achievements.${current.key}_description`)}
            </motion.p>

            <motion.button
              type="button"
              onClick={dismiss}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52 }}
              className="w-full min-2000px:h-[2.2vw] h-12 min-2000px:rounded-[.5vw] rounded-xl dark:bg-white/10 dark:text-white bg-gray-900 text-white font-[600] min-2000px:text-[.75vw] hover:ring-2 ring-main/70 duration-300 cursor-pointer"
            >
              {t("achievements.got_it")}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

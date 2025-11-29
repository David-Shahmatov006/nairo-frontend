import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RxAvatar } from "react-icons/rx";
import { useTranslation } from "react-i18next";

export const RandomConnectModal = ({ isOpen, onClose }: any) => {
  const [stage, setStage] = useState<"search" | "found">("search");
  const { t } = useTranslation();
  useEffect(() => {
    if (!isOpen) return;

    setStage("search");

    const timeout = setTimeout(() => {
      setStage("found");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isOpen]);

  const mockUser = {
    name: "Emily Carter",
    age: 23,
    avatar: "",
    interests: ["Music", "Travel", "Design", "Coding", "Gym"],
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="font-manrope fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="dark:bg-black/50 bg-white w-[360px] rounded-2xl p-6 shadow-xl relative"
          >
            {stage === "search" && (
              <div className="flex flex-col items-center py-10">
                <div className="relative w-40 h-40 mb-6">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-main"
                    initial={{ scale: 0.4, opacity: 0.9 }}
                    animate={{
                      scale: [0.4, 1.2],
                      opacity: [0.9, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.8,
                      ease: "easeOut",
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-main/40"
                    initial={{ scale: 0.3, opacity: 0.8 }}
                    animate={{
                      scale: [0.3, 1.1],
                      opacity: [0.8, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.8,
                      ease: "easeOut",
                      delay: 0.4,
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-main/20"
                    initial={{ scale: 0.2, opacity: 0.6 }}
                    animate={{
                      scale: [0.2, 0.9],
                      opacity: [0.6, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.8,
                      ease: "easeOut",
                      delay: 0.8,
                    }}
                  />
                </div>

                <motion.p
                  className="dark:text-white/70 text-gray-700 text-[17px] font-semibold"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  {t('random_connect_modal.searching_text')}
                </motion.p>
              </div>
            )}

            {stage === "found" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <div className="w-[90px] h-[90px] mx-auto rounded-full dark:bg-white/10 bg-gray-200 flex items-center justify-center overflow-hidden mb-3">
                  {mockUser.avatar ? (
                    <img
                      src={mockUser.avatar}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <RxAvatar className="text-main/40 w-12 h-12" />
                  )}
                </div>

                <p className="text-[18px] font-semibold dark:text-white/70 text-gray-900">
                  {mockUser.name}
                </p>

                <p className="text-gray-500 text-sm mt-1 mb-4">
                  {t('random_connect_modal.common_interests')}
                </p>

                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {mockUser.interests.map((i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-main/10 text-main text-[13px] rounded-full border border-main/20"
                    >
                      {i}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() =>
                    console.log("Start chat with: ", mockUser.name)
                  }
                  className="w-full dark:bg-white/5 bg-gray-900 text-white py-2 rounded-xl font-semibold hover:ring-2 ring-main/70 cursor-pointer duration-300"
                >
                  {t('random_connect_modal.connect')}
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

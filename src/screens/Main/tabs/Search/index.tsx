import { IoIosSearch } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import searchMuskot from "../../../../assets/images/search_muskot.webp";
import { TfiClose } from "react-icons/tfi";
import { useTranslation } from "react-i18next";
import { GoPlus } from "react-icons/go";
import { useAppStore } from "../../../../stores/app";
import { AvatarImage } from "../../../../components/AvatarImage";

export const Search = () => {
  const { t } = useTranslation();
  const { setActiveTab } = useAppStore();
  const dummyUsers = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alex Johnson" },
  ];
  const handleClose = () => {
    localStorage.setItem("activeTab", "0");
    setActiveTab(0);
  };

  return (
    <AnimatePresence>
      <motion.div
        onClick={handleClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-[7px] flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="font-montreal w-full max-w-md dark:bg-white/5 bg-white rounded-2xl p-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="dark:text-white/80 text-[20px] font-[500]">
              {t("search.title")}
            </h1>
            <button
              onClick={handleClose}
              className="w-[40px] dark:bg-white/10 dark:border-white/10 bg-white border flex items-center justify-center border-[#E5E7EB] rounded-[12px] h-[40px] top-[32px] right-[32px] cursor-pointer hover:ring-2 hover:ring-main/70 duration-300"
            >
              <TfiClose className="dark:text-white/80" />
            </button>
          </div>

          <div className="relative w-full mb-4">
            <IoIosSearch className="text-[20px] absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t("search.placeholder")}
              className="dark:text-white/80 w-full pl-10 pr-4 py-2 border dark:border-white/20 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
            />
          </div>

          <div className="flex flex-col gap-4">
            {true ? (
              <div className="mt-[5%] flex flex-col items-center gap-3">
                <img src={searchMuskot} className="w-[100px]" />
                <span className="dark:text-white/40 text-[17px] text-center">
                  {t("search.find_desc")}
                </span>
              </div>
            ) : (
              dummyUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between px-4 py-2 dark:bg-white/5 bg-white rounded-[20px] shadow hover:bg-gray-50 cursor-pointer duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10">
                      <AvatarImage src="" />
                    </div>
                    <h2 className="dark:text-white/80 font-medium">{user.name}</h2>
                  </div>

                  <button className="flex items-center gap-1 px-4 py-2 dark:bg-white/5 bg-gray-900 text-white rounded-md hover:ring-2 ring-main/70 cursor-pointer duration-300">
                    <GoPlus className="text-[20px]" />
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

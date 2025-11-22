import { IoIosSearch } from "react-icons/io";
import { RxAvatar } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
import searchMuskot from "../../../../assets/images/search_muskot.webp";
import { TfiClose } from "react-icons/tfi";
import { useTranslation } from "react-i18next";
import { GoPlus } from "react-icons/go";
import { useAppStore } from "../../../../stores/app";

export const Search = () => {
  const { t } = useTranslation();
  const {setActiveTab} = useAppStore()
  const dummyUsers = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alex Johnson" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-[7px] flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="font-montreal w-full max-w-md bg-white rounded-2xl p-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[20px] font-[500]">{t("search.title")}</h1>
            <button
              onClick={() => {
                localStorage.setItem("activeTab", "0");
                setActiveTab(0);
              }}
              className="w-[40px] bg-[#FFFFFF] border flex items-center justify-center border-[#E5E7EB] rounded-[12px] h-[40px] top-[32px] right-[32px] cursor-pointer hover:ring-2 hover:ring-main/40 duration-300"
            >
              <TfiClose />
            </button>
          </div>

          <div className="relative w-full mb-4">
            <IoIosSearch className="text-[20px] absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t("search.placeholder")}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main/40 duration-300"
            />
          </div>

          <div className="flex flex-col gap-4">
            {true ? (
              <div className="mt-[5%] flex flex-col items-center gap-3">
                <img src={searchMuskot} className="w-[100px]" />
                <span className="text-[17px] text-center">
                  {t("search.find_desc")}
                </span>
              </div>
            ) : (
              dummyUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:bg-gray-50 cursor-pointer duration-300"
                >
                  <div className="flex items-center gap-4">
                    <RxAvatar className="w-10 h-10 text-gray-400" />
                    <h2 className="font-medium">{user.name}</h2>
                  </div>

                  <button className="flex items-center gap-1 px-4 py-1 bg-main text-white rounded-md hover:bg-main/90 cursor-pointer duration-300">
                    {t("search.connect")}
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

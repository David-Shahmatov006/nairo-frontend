import { IoIosSearch } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import searchMuskot from "../../../../assets/images/search_muskot.webp";
import thinkingMuskot from "../../../../assets/images/thinkingMuskot.webp";
import { TfiClose } from "react-icons/tfi";
import { useTranslation } from "react-i18next";
import { AvatarImage } from "../../../../components/AvatarImage";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { userService } from "../../../../services/user.service";
import useSWR from "swr";
import type { User } from "../../../../types/user";
import { useDebounceValue } from "usehooks-ts";
import { BiLoaderAlt } from "react-icons/bi";

export const Search = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [debouncedQuery] = useDebounceValue(query, 1000);
  const { data: users, isLoading } = useSWR(
    debouncedQuery.length > 0 ? ["search", debouncedQuery] : null,
    () => userService.searchUsers(debouncedQuery),
  );

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        onClick={() => navigate(-1)}
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
          className="font-montreal w-full max-w-md dark:bg-white/5 bg-white rounded-2xl max-768px:p-4 p-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="dark:text-white/80 text-[20px] font-[500]">
              {t("search.title")}
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="w-[40px] h-[40px] max-768px:size-9 max-768px:top-4 max-768px:right-4 top-4 right-4 flex items-center justify-center rounded-[12px] border dark:border-white/10 border-gray-300 dark:bg-white/10 bg-white hover:ring-2 hover:ring-main/70 duration-300"
            >
              <TfiClose className="dark:text-white/80" />
            </button>
          </div>

          <div className="relative w-full mb-4">
            <IoIosSearch className="text-[20px] absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder={t("search.placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="dark:text-white/80 w-full pl-10 pr-4 py-2 border dark:border-white/20 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
            />
          </div>

          <div className="flex flex-col gap-4">
            {!debouncedQuery ? (
              <div className="mt-[5%] flex flex-col items-center gap-3">
                <img src={searchMuskot} className="w-[100px]" />
                <span className="dark:text-[#6f6f6f] max-768px:text-[14px] text-[17px] text-center">
                  {t("search.find_desc")}
                </span>
              </div>
            ) : isLoading ? (
              <div className="flex justify-center items-center w-full mt-5">
                <BiLoaderAlt className="animate-spin text-main text-[30px]" />
              </div>
            ) : users?.length === 0 ? (
              <div className="mt-[5%] flex flex-col items-center gap-3">
                <img src={thinkingMuskot} className="w-[100px]" />
                <span className="dark:text-[#6f6f6f] max-768px:text-[14px] text-[17px] text-center">
                  {t("search.no_results")}
                </span>
              </div>
            ) : (
              <div className="max-h-[40vh] overflow-y-auto scrollbar-hidden flex flex-col gap-3">
                {users.map((u: User) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between px-4 py-2 dark:bg-white/5 bg-white rounded-[20px] shadow hover:bg-gray-50 cursor-pointer duration-300"
                    onClick={() => navigate(`/user/${u.id}`)}
                  >
                    <div className="flex items-center max-768px:gap-2 gap-4">
                      <div className="size-10">
                        <AvatarImage src={u.avatar} />
                      </div>
                      <h2 className="dark:text-white/80 font-medium line-clamp-1">
                        {u.firstName} {u.lastName}
                      </h2>
                    </div>
                    <span className="text-[14px] dark:text-white/30 text-black/50">
                      @{u.username}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

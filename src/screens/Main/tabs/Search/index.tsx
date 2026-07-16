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
        className="fixed inset-0 bg-black/40 min-2000px:backdrop-blur-[.5vw] backdrop-blur-[7px] flex items-center justify-center z-50"
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
          className="font-montreal w-full min-2000px:max-w-[22vw] max-w-md dark:bg-[#202020] bg-white min-2000px:rounded-[1vw] rounded-2xl max-768px:p-4 min-2000px:p-[1vw] p-6 shadow-xl"
        >
          <div className="flex items-center justify-between min-2000px:mb-[1vw] mb-4">
            <h1 className="dark:text-white/80 min-2000px:text-[1vw] text-[20px] font-[500]">
              {t("search.title")}
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="min-2000px:size-[2vw] size-[40px] max-768px:size-9 min-2000px:top-[1vw] top-4 min-2000px:right-[1vw] right-4 flex items-center justify-center min-2000px:rounded-[.5vw] rounded-[12px] border dark:border-white/10 border-gray-300 dark:bg-white/10 bg-white hover:ring-2 hover:ring-main/70 duration-300 cursor-pointer"
            >
              <TfiClose className="min-2000px:text-[.8vw] dark:text-white/80" />
            </button>
          </div>

          <div className="relative w-full min-2000px:mb-[1vw] mb-4">
            <IoIosSearch className="min-2000px:text-[1vw] text-[20px] absolute min-2000px:left-[.5vw] left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder={t("search.placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="dark:text-white/80 w-full min-2000px:pl-[1.8vw] pl-10 min-2000px:pr-[1vw] pr-4 min-2000px:py-[.4vw] py-2 border dark:border-white/20 border-gray-300 min-2000px:rounded-[0.5vw] rounded-lg min-2000px:text-[.8vw] focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
            />
          </div>

          <div className="flex flex-col min-2000px:gap-[1vw] gap-4">
            {!debouncedQuery ? (
              <div className="mt-[5%] flex flex-col items-center min-2000px:gap-[1vw] gap-3">
                <img src={searchMuskot} className="min-2000px:w-[5vw] w-[100px]" />
                <span className="dark:text-[#6f6f6f] max-768px:text-[14px] min-2000px:text-[.8vw] text-[17px] text-center">
                  {t("search.find_desc")}
                </span>
              </div>
            ) : isLoading ? (
              <div className="flex justify-center items-center w-full min-2000px:mt-[.3vw] mt-5">
                <BiLoaderAlt className="animate-spin text-main min-2000px:text-[1.5vw] text-[30px]" />
              </div>
            ) : users?.length === 0 ? (
              <div className="mt-[5%] flex flex-col items-center min-2000px:gap-[1vw] gap-3">
                <img src={thinkingMuskot} className="min-2000px:w-[5vw] w-[100px]" />
                <span className="dark:text-[#6f6f6f] max-768px:text-[14px] min-2000px:text-[.8vw] text-[17px] text-center">
                  {t("search.no_results")}
                </span>
              </div>
            ) : (
              <div className="min-2000px:max-h-[25vh] max-h-[40vh] overflow-y-auto scrollbar-hidden flex flex-col min-2000px:gap-[.5vw] gap-3">
                {users.map((u: User) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between min-2000px:px-[.6vw] px-4 min-2000px:py-[.5vw] py-2 dark:bg-white/5 bg-white min-2000px:rounded-[.7vw] rounded-[20px] shadow hover:bg-gray-50 cursor-pointer duration-300"
                    onClick={() => navigate(`/user/${u.id}`)}
                  >
                    <div className="flex items-center max-768px:gap-2 min-2000px:gap-[.4vw] gap-4">
                      <div className="min-2000px:size-[1.7vw] size-10">
                        <AvatarImage src={u.avatar} />
                      </div>
                      <h2 className="min-2000px:text-[.8vw] dark:text-white/80 font-medium line-clamp-1">
                        {u.firstName} {u.lastName}
                      </h2>
                    </div>
                    <span className="min-2000px:text-[0.7vw] text-[14px] dark:text-white/30 text-black/50">
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

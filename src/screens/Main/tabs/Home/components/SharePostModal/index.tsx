import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosClose } from "react-icons/io";
import { RxAvatar } from "react-icons/rx";
import clsx from "clsx";
import { FaCheck } from "react-icons/fa";
import surprisedMuskot from "../../../../../../assets/images/surprisedMuskot.webp";
import { useTranslation } from "react-i18next";

interface User {
  id: number;
  name: string;
  username: string;
  avatar?: string;
}

interface SharePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (selectedUsers: User[]) => void;
  users: User[];
}

export const SharePostModal = ({
  isOpen,
  onClose,
  onSend,
  users,
}: SharePostModalProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<User[]>([]);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.username.toLowerCase().includes(query.toLowerCase())
  );

  const toggleUser = (user: User) => {
    if (selected.some((s) => s.id === user.id)) {
      setSelected(selected.filter((s) => s.id !== user.id));
    } else {
      setSelected([...selected, user]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={onClose}
          className="font-manrope fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl font-manrope"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[20px] font-[700] text-gray-900">
                {t("share_post.title")}
              </h2>

              <button
                onClick={onClose}
                className="bg-gray-200 hover:ring-2 ring-main/40 p-1 rounded-full duration-300 cursor-pointer"
              >
                <IoIosClose size={26} className="text-gray-700" />
              </button>
            </div>

            {selected.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selected.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 bg-main/10 border border-main/20 text-main px-3 py-1 rounded-full"
                  >
                    <span>{user.name}</span>
                    <IoIosClose
                      className="cursor-pointer"
                      onClick={() => toggleUser(user)}
                    />
                  </div>
                ))}
              </div>
            )}

            <input
              type="text"
              placeholder={t("share_post.search_users_placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-gray-100 outline-none focus:ring-2 ring-main/40 duration-300 text-gray-800 mb-4"
            />

            <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center">
                  <img src={surprisedMuskot} className="w-[120px]" />
                  <p className="text-gray-500 text-center py-4">
                    {t("share_post.no_users_found")}
                  </p>
                </div>
              ) : (
                filtered.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => toggleUser(user)}
                    className={clsx(
                      "flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-100 duration-300"
                    )}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <RxAvatar className="text-main/50 w-6 h-6" />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span className="font-[600] text-gray-900">
                        {user.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        @{user.username}
                      </span>
                    </div>

                    <div className="ml-auto">
                      {selected.some((s) => s.id === user.id) ? (
                        <div className="size-5 rounded-full bg-main flex items-center justify-center text-white text-xs">
                          <FaCheck />
                        </div>
                      ) : (
                        <div className="size-5 rounded-full border border-gray-400" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => onSend(selected)}
              disabled={selected.length === 0}
              className="mt-6 w-full bg-gray-900 hover:ring-2 ring-main/70 cursor-pointer text-white py-3 rounded-xl text-[16px] font-semibold disabled:opacity-50 disabled:pointer-events-none duration-300"
            >
              {t("share_post.share_button")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

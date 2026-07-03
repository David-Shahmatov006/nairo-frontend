import { useNavigate } from "react-router-dom";
import { AvatarImage } from "../../../../../../components/AvatarImage";
import type { User } from "../../../../../../types/user";
import { AnimatePresence, motion } from "framer-motion";

interface IProps {
  users: User[];
  onClose: () => void;
  open: boolean;
}

export const FollowListModal = ({ users, open, onClose }: IProps) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-[7px] flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative dark:bg-white/5 bg-white p-5 max-550px:!w-full [@media(min-width:530px)_and_(max-width:930px)]:w-[70%] w-[35%] rounded-[20px]"
          >
            <div className="max-h-[50vh] overflow-y-auto custom-scrollbar flex flex-col items-center gap-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="w-full flex items-center justify-between px-4 py-2 dark:bg-white/5 bg-white shadow rounded-[20px] hover:bg-gray-50 cursor-pointer duration-300"
                  onClick={() => navigate(`/user/${user.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10">
                      <AvatarImage src={user.avatar} />
                    </div>
                    <h2 className="dark:text-white/80 font-medium">
                      {user.firstName} {user.lastName}
                    </h2>
                  </div>
                  <span className="text-[14px] dark:text-white/30 text-black/50">
                    @{user.username}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

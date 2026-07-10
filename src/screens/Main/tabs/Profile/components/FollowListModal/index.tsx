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
          className="fixed inset-0 bg-black/40 backdrop-blur-[7px] flex items-center justify-center z-50 min-2000px:p-[.5vw] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative dark:bg-white/5 bg-white min-2000px:p-[.6vw] p-5 max-550px:!w-full [@media(min-width:530px)_and_(max-width:930px)]:w-[70%] min-2000px:w-[25vw] w-[35%] min-2000px:rounded-[.4vw] rounded-[20px]"
          >
            <div className="min-2000px:max-h-[18vw] max-h-[50vh] overflow-y-auto custom-scrollbar flex flex-col items-center min-2000px:gap-[.4vw] gap-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="w-full flex items-center justify-between min-2000px:px-[.5vw] px-4 min-2000px:py-[.3vw] py-2 dark:bg-white/5 bg-white shadow min-2000px:rounded-[.4vw] rounded-[20px] hover:bg-gray-50 cursor-pointer duration-300"
                  onClick={() => navigate(`/user/${user.id}`)}
                >
                  <div className="flex items-center min-2000px:gap-[.3vw] gap-4">
                    <div className="min-2000px:size-[2vw] size-10">
                      <AvatarImage src={user.avatar} />
                    </div>
                    <h2 className="min-2000px:text-[.8vw] dark:text-white/80 font-medium">
                      {user.firstName} {user.lastName}
                    </h2>
                  </div>
                  <span className="min-2000px:text-[.65vw] text-[14px] dark:text-white/30 text-black/50">
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

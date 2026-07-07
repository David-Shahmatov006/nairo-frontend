import { AnimatePresence, motion } from "framer-motion";

interface IProps {
  avatar: string;
  open: boolean;
  onClose: () => void;
}

export const ShowAvatarImage = ({ avatar, open, onClose }: IProps) => {
  console.log(avatar, "777");

  return (
    avatar && (
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
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="relative dark:bg-white/5 bg-white p-3 max-550px:!w-full [@media(min-width:530px)_and_(max-width:930px)]:w-[50%] w-[35%] rounded-md"
            >
              <img src={avatar} className="rounded-md" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  );
};

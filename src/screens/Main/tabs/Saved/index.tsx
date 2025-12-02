import { useTranslation } from "react-i18next";
import surprisedMuskot from "../../../../assets/images/surprisedMuskot.webp";
import { motion } from "framer-motion";
import { Posts } from "../Home/components/Posts";

const dummyPosts = [
  { id: 1, title: "My First Post", author: "John Doe" },
  { id: 2, title: "React Tips & Tricks", author: "Jane Smith" },
  { id: 3, title: "Travel Diaries", author: "Alex Johnson" },
];

export const Saved = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="font-manrope p-6 flex flex-col gap-4"
    >
      <h1 className="dark:text-white/80 text-[20px] font-[600]">{t("saved.title")}</h1>
      <p className="text-gray-500 text-sm mb-4">{t("saved.subtitle")}</p>

      <div className="flex flex-col gap-4">
        {dummyPosts.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-3">
            <img src={surprisedMuskot} className="w-[120px]" />
            <span className="text-[17px] text-gray-500 text-center">
              {t("saved.no_posts")}
            </span>
          </div>
        ) : (
         <Posts mode="saved" />
        )}
      </div>
    </motion.div>
  );
};

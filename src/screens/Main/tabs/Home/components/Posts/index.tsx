import { motion } from "framer-motion";
import useSWR from "swr";
import { postService } from "../../../../../../services/post.service";
import { PostItem } from "./components/PostItem";
import surprisedMuskot from "../../../../../../assets/images/surprisedMuskot2.webp";
import { useTranslation } from "react-i18next";
import { Loader } from "../../../../../../components/Loader";
import { useLocation } from "react-router-dom";
import clsx from "clsx";
interface PostsProps {
  mode: "all" | "saved" | "user";
  userId?: string;
  isOwnProfile?: boolean;
}

export const Posts = ({ mode, userId, isOwnProfile }: PostsProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { data: posts, isLoading } = useSWR(
    mode === "user"
      ? ["posts-user"]
      : mode === "saved"
      ? ["posts-saved"]
      : ["posts-all"],

    () =>
      mode === "user"
        ? postService.getUserPosts(userId as string)
        : mode === "saved"
        ? postService.getSavedPosts()
        : postService.getRandomPosts()
  );

  if (isLoading) return <Loader />;

  if (!posts || posts.length === 0)
    return (
      <div className="flex-1 flex flex-col justify-center items-center">
        <img src={surprisedMuskot} className="w-[120px]" />
        <p className="text-gray-500 text-center py-4">{t("no_posts")}</p>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, x: "-20%" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className={clsx(
        "rounded-xl grid max-768px:grid-cols-1 grid-cols-2 gap-6",
        (location.pathname.includes("profile") ||
          location.pathname.includes("user")) &&
          "custom-scrollbar max-h-[63.5vh] overflow-y-auto"
      )}
    >
      {posts.map((post: any) => (
        <PostItem key={post.id} post={post} isOwnProfile={isOwnProfile} />
      ))}
    </motion.div>
  );
};

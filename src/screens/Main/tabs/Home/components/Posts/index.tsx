import { motion } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Loader } from "../../../../../../components/Loader";
import { PostItem } from "./components/PostItem";
import surprisedMuskot from "../../../../../../assets/images/surprisedMuskot2.webp";
import { BiLoaderAlt } from "react-icons/bi";
import { useUser } from "../../../../../../hooks/useUser";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../../../../../../stores/auth";
import { usePosts } from "../../../../../../hooks/usePosts";

interface PostsProps {
  mode: "all" | "saved" | "user";
}

export const Posts = ({ mode }: PostsProps) => {
  const { t } = useTranslation();
  const { id: userIdFromUrl } = useParams();
  const { user } = useAuthStore();
  const trueUserId = userIdFromUrl ?? user?.id;

  const { isOwnProfile } = useUser(trueUserId);
  const scrollable = mode === "user";

  const { data, setSize, isLoading, isValidating, mutate } = usePosts(mode);
  if (isLoading && !data) {
    return <Loader />;
  }

  const posts = data?.flatMap((page) => page.posts) ?? [];

  const hasMore = data?.[data.length - 1]?.hasMore ?? false;

  if (!posts.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <img src={surprisedMuskot} className="min-2000px:w-[7vw] w-[120px]" />
        <p className="min-2000px:py-[1vw] min-2000px:text-[.8vw] py-4 text-center text-gray-500">{t("no_posts")}</p>
      </div>
    );
  }

  const content = (
    <InfiniteScroll
      dataLength={posts.length}
      next={() => setSize((s) => s + 1)}
      hasMore={hasMore}
      scrollableTarget={scrollable ? "posts-scroll" : undefined}
      loader={
        isValidating ? (
          <div className="flex justify-center py-6">
            <BiLoaderAlt className="animate-spin text-main text-[28px]" />
          </div>
        ) : null
      }
      className="w-full"
    >
      <div
        className={clsx(
          "grid gap-6 rounded-xl",
          "grid-cols-2 max-768px:grid-cols-1 pb-4",
        )}
      >
        {posts.map((post: any) => (
          <PostItem
            key={post.id}
            post={post}
            isOwnProfile={isOwnProfile}
            mode={mode}
            mutate={mutate}
          />
        ))}
      </div>
    </InfiniteScroll>
  );

  if (scrollable) {
    return (
      <motion.div
        id="posts-scroll"
        initial={{ opacity: 0, x: "-20%" }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full custom-scrollbar max-h-[63.5vh] overflow-y-auto"
      >
        {content}
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: "-20%" }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {content}
      </motion.div>
    </>
  );
};

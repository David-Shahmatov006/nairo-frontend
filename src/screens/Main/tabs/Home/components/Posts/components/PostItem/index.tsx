import { PiImageBroken } from "react-icons/pi";
import type { Post } from "../../../../../../../../types/post";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../../../../../../utils/formatDate";
import { postService } from "../../../../../../../../services/post.service";
import { BiLoaderAlt } from "react-icons/bi";
import { motion } from "framer-motion";
import { useAuthStore } from "../../../../../../../../stores/auth";
import {
  useAppStore,
  type PostsMode,
} from "../../../../../../../../stores/app";
import { FiEdit3 } from "react-icons/fi";
import type { SWRInfiniteKeyedMutator } from "swr/infinite";

interface IPostProps {
  post: Post;
  isOwnProfile?: boolean;
  mode: PostsMode;
  mutate: SWRInfiniteKeyedMutator<any[]>;
}

export const PostImage = ({
  src,
  title,
  onModal,
}: {
  src: string;
  title: string;
  onModal?: boolean;
}) => {
  const [hasError, setHasError] = useState(false);

  const API = import.meta.env.VITE_API_URL;
  const fullSrc = src.startsWith("/uploads") ? `${API}${src}` : src;

  if (!src || hasError) {
    return (
      <div
        className={clsx(
          "w-full h-full flex items-center justify-center dark:bg-white/5 bg-gray-200",
          onModal ? "rounded-xl" : "max-768px:rounded-l-none rounded-l-xl",
        )}
      >
        <PiImageBroken size={40} className="text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={fullSrc}
      alt={title}
      loading="lazy"
      decoding="async"
      className={clsx(
        "w-full h-full object-cover",
        onModal
          ? "rounded-xl"
          : "max-768px:rounded-l-none max-1024px:rounded-t-xl rounded-l-xl",
      )}
      onError={() => setHasError(true)}
    />
  );
};

export const PostItem = ({ post, mode, mutate }: IPostProps) => {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes ?? 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuthStore();
  const isOwnPost = post?.user?.id === user?.id;
  const { openEditPostModal } = useAppStore();
  const navigate = useNavigate();

  const handleToggleSave = async () => {
    try {
      const res = await postService.toggleSave(post.id);

      setSaved(res.saved);

      mutate(
        (pages) => {
          if (!pages) return pages;

          return pages
            .map((page) => ({
              ...page,
              posts:
                mode === "saved" && !res.saved
                  ? page.posts.filter((p: any) => p.id !== post.id)
                  : page.posts.map((p: any) =>
                      p.id === post.id
                        ? {
                            ...p,
                            isSaved: res.saved,
                          }
                        : p,
                    ),
            }))
            .filter((page) => page.posts.length > 0 || page.hasMore);
        },
        { revalidate: false },
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleLike = async () => {
    if (isLiking) return;

    const previousLiked = liked;
    const previousLikesCount = likesCount;
    const nextLiked = !previousLiked;

    setIsLiking(true);
    setLiked(nextLiked);
    setLikesCount(
      Math.max(0, previousLikesCount + (nextLiked ? 1 : -1)),
    );

    try {
      const res = await postService.toggleLike(post.id);

      setLiked(res.isLiked);
      setLikesCount(res.likes);

      mutate(
        (pages) => {
          if (!pages) return pages;

          return pages.map((page) => ({
            ...page,
            posts: page.posts.map((p: any) =>
              p.id === post.id
                ? {
                    ...p,
                    isLiked: res.isLiked,
                    likes: res.likes,
                  }
                : p,
            ),
          }));
        },
        { revalidate: false },
      );
    } catch (e) {
      setLiked(previousLiked);
      setLikesCount(previousLikesCount);
      console.error(e);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    setIsDeleting(true);

    try {
      await postService.deletePost(postId);

      mutate(
        (pages) => {
          if (!pages) return pages;

          return pages.map((page) => ({
            ...page,
            posts: page.posts.filter((p: any) => p.id !== postId),
          }));
        },
        { revalidate: false },
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (post) {
      setSaved(post.isSaved!);
      setLiked(post.isLiked!);
      setLikesCount(post.likes ?? 0);
    }
  }, [post]);

  return (
    <div
      onClick={() => navigate(`/post/${post.id}`)}
      key={post.id}
      className="cursor-pointer dark:bg-white/5 bg-white min-2000px:rounded-[.6vw] rounded-xl shadow hover:shadow-lg duration-300 flex max-1440px:flex-col"
    >
      <div className="flex-shrink-0 max-1440px:w-full min-2000px:size-[9vw] size-48">
        <PostImage src={post.image} title={post.title} />
      </div>

      <div className="min-2000px:p-[.7vw] p-4 flex flex-col flex-1 min-2000px:gap-[0.3vw] gap-2">
        <div className="flex items-center justify-between dark:text-[#6f6f6f] text-gray-500 min-2000px:text-[.75vw] text-sm">
          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (!isOwnPost) {
                navigate(`/user/${post.user.id}`);
              }
            }}
            className="hover:text-main/80 duration-300 cursor-pointer font-[500] min-2000px:max-w-[15vw] max-w-[8vw] min-1600px:max-w-[13vw] min-1900px:max-w-[16vw] line-clamp-1"
          >
            {post.user.firstName} {post.user.lastName}
          </span>

          <span>{formatDate(post.createdAt)}</span>
        </div>

        <h3 className="min-2000px:text-[.9vw] text-lg font-semibold dark:text-[#f9f5e8] text-gray-900 line-clamp-1">
          {post.title}
        </h3>
        <p className="dark:text-[#6f6f6f] text-gray-700 min-2000px:text-[.7vw] text-sm line-clamp-2">
          {post.description}
        </p>

        <div className="flex items-center justify-between mt-auto dark:text-[#6f6f6f] text-gray-600">
          <div className="flex items-center min-2000px:gap-[.9vw] gap-4">
            <motion.button
              disabled={isLiking}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggleLike();
              }}
              whileTap={{ scale: 0.7 }}
              initial={{ scale: 1 }}
              animate={liked ? { scale: [1, 1.9, 1] } : {}}
              transition={{ duration: 0.25 }}
              className={clsx(
                "min-2000px:text-[0.8vw] flex items-center min-2000px:gap-[.3vw] gap-1 hover:text-main duration-300 cursor-pointer",
                liked && "text-main",
              )}
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
              <span>{likesCount}</span>
            </motion.button>

            <motion.button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggleSave();
              }}
              whileTap={{ scale: 0.7 }}
              initial={{ scale: 1 }}
              animate={saved ? { scale: [1, 1.9, 1] } : {}}
              transition={{ duration: 0.25 }}
              className={clsx(
                "min-2000px:text-[0.8vw] flex items-center hover:text-main duration-300 cursor-pointer flex items-center",
                saved && "text-main",
              )}
            >
              {saved ? <FaBookmark /> : <FaRegBookmark />}
            </motion.button>

            {isOwnPost && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openEditPostModal(post, mode);
                }}
                className="flex items-center hover:text-main duration-300 cursor-pointer flex items-center"
              >
                <FiEdit3 className="min-2000px:text-[0.8vw] text-[17px]" />
              </button>
            )}
          </div>
          {isOwnPost && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                handleDeletePost(post.id);
              }}
              disabled={isDeleting}
              className="min-2000px:text-[0.8vw] flex items-center justify-center min-2000px:size-[1.1vw] size-6 rounded cursor-pointer dark:hover:bg-white/10 hover:bg-red-200 duration-300"
            >
              {isDeleting ? (
                <BiLoaderAlt className="animate-spin" />
              ) : (
                <RiDeleteBin6Line className="text-red-400" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

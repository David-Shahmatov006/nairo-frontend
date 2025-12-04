import { PiImageBroken, PiShareFat } from "react-icons/pi";
import type { Post } from "../../../../../../../../types/post";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useAppStore } from "../../../../../../../../stores/app";
import { formatDate } from "../../../../../../../../utils/formatDate";
import { postService } from "../../../../../../../../services/post.service";
import { mutate } from "swr";
import { BiLoaderAlt } from "react-icons/bi";

interface IPostProps {
  post: Post;
  isOwnProfile?: boolean;
}

export const PostImage = ({ src, title }: { src: string; title: string }) => {
  const [hasError, setHasError] = useState(false);

  const API = import.meta.env.VITE_API_URL;
  const fullSrc = src.startsWith("/uploads") ? `${API}${src}` : src;

  if (!src || hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center dark:bg-white/5 bg-gray-200 rounded-l-xl">
        <PiImageBroken size={40} className="text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={fullSrc}
      alt={title}
      className="w-full h-full object-cover rounded-l-xl"
      onError={() => setHasError(true)}
    />
  );
};

export const PostItem = ({ post, isOwnProfile }: IPostProps) => {
  const { setShareOpen } = useAppStore();
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleSave = async () => {
    try {
      const res = await postService.toggleSave(post.id);
      setSaved(res.saved);
      mutate(["posts-user", post.user.id]);
      mutate(["posts-saved"]);
      mutate(["post", post.id]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleLike = async () => {
    try {
      const res = await postService.toggleLike(post.id);
      setLiked(res.isLiked);

      mutate(
        ["posts-all"],
        (prev: any) => {
          if (!prev) return prev;
          return prev.map((p: any) =>
            p.id === post.id
              ? { ...p, isLiked: res.isLiked, likes: res.likes }
              : p
          );
        },
        false
      );

      mutate(
        ["posts-user"],
        (prev: any) => {
          if (!prev) return prev;
          return prev.map((p: any) =>
            p.id === post.id
              ? { ...p, isLiked: res.isLiked, likes: res.likes }
              : p
          );
        },
        false
      );

      mutate(
        ["posts-saved"],
        (prev: any) => {
          if (!prev) return prev;
          return prev.map((p: any) =>
            p.id === post.id
              ? { ...p, isLiked: res.isLiked, likes: res.likes }
              : p
          );
        },
        false
      );

      mutate(["post", post.id]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePost = async (postId: string) => {
    setIsDeleting(true);
    try {
      await postService.deletePost(postId);
      mutate(["posts-user"]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (post) {
      setSaved(post.isSaved!);
      setLiked(post.isLiked!);
    }
  }, [post]);

  return (
    <Link to={`/post/${post?.id}`}>
      <div
        key={post.id}
        className="dark:bg-white/5 bg-white rounded-xl shadow hover:shadow-lg duration-300 overflow-hidden flex"
      >
        <div className="flex-shrink-0 w-48 h-48 dark:bg-white/10 bg-gray-200">
          <PostImage src={post.image} title={post.title} />
        </div>

        <div className="p-4 flex flex-col flex-1 gap-2">
          <div className="flex items-center justify-between dark:text-[#6f6f6f] text-gray-500 text-sm">
            <Link to={isOwnProfile ? "" : `/user/${post.user.id}`}>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="hover:text-main/80 duration-300 cursor-pointer font-[500]"
              >
                {post.user.firstName} {post.user.lastName}
              </span>
            </Link>
            <span>{formatDate(post.createdAt)}</span>
          </div>

          <h3 className="text-lg font-semibold dark:text-[#f9f5e8] text-gray-900">
            {post.title}
          </h3>
          <p className="dark:text-[#6f6f6f]  text-gray-700 text-sm line-clamp-2">
            {post.description}
          </p>

          <div className="flex items-center justify-between mt-auto dark:text-[#6f6f6f] text-gray-600">
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.preventDefault();

                  e.stopPropagation();
                  handleToggleLike();
                }}
                className={clsx(
                  "flex items-center gap-1 hover:text-main duration-300 cursor-pointer",
                  liked && "text-main"
                )}
              >
                {liked ? <FaHeart /> : <FaRegHeart />}
                <span>{post.likes}</span>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleSave();
                }}
                className={clsx(
                  "flex items-center gap-2 hover:text-main duration-300 cursor-pointer flex items-center gap-1",
                  saved && "text-main"
                )}
              >
                {saved ? <FaBookmark /> : <FaRegBookmark />}
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShareOpen(true);
                }}
                className="flex items-center gap-1 hover:text-main duration-300 cursor-pointer"
              >
                <PiShareFat className="text-[20px]" />
              </button>
            </div>
            {isOwnProfile && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDeletePost(post.id);
                }}
                disabled={isDeleting}
                className="flex items-center justify-center size-6 rounded cursor-pointer dark:hover:bg-white/10 hover:bg-red-200 duration-300"
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
    </Link>
  );
};

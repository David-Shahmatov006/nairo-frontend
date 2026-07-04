import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import clsx from "clsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { BackButton } from "../../../../../../../../components/BackButton";
import { PostImage } from "../PostItem";
import { AvatarImage } from "../../../../../../../../components/AvatarImage";
import { Comments } from "./components/Comments";
import { IoIosArrowDown } from "react-icons/io";
import { motion } from "framer-motion";
import useSWR, { mutate } from "swr";
import { postService } from "../../../../../../../../services/post.service";
import { formatDate } from "../../../../../../../../utils/formatDate";
import thinkingMuskot from "../../../../../../../../assets/images/thinkingMuskot.webp";
import { useTranslation } from "react-i18next";
import { Loader } from "../../../../../../../../components/Loader";

export const PostPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: post, isLoading } = useSWR(id ? ["post", id] : null, () =>
    postService.getPostInfo(id!)
  );

  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const [maxHeight, setMaxHeight] = useState("100px");

  const handleToggleSave = async () => {
    try {
      const res = await postService.toggleSave(post.id);
      setSaved(res.saved);
      mutate(["posts-user"]);
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
      mutate(["post", post.id]);

    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (post) {
      setSaved(post.isSaved);
      setLiked(post.isLiked);
    }
  }, [post]);

  useEffect(() => {
    if (descriptionRef.current) {
      setMaxHeight(
        isExpanded ? `${descriptionRef.current.scrollHeight}px` : "100px"
      );
    }
  }, [isExpanded]);

  if (isLoading) return <Loader />;
  if (!post)
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3">
        <img src={thinkingMuskot} className="w-[100px]" />
        <span className="text-[17px] text-gray-500 text-center">
          {t("post_page.not_found")}
        </span>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="font-manrope  w-full max-768px:max-w-full max-w-[80%] max-768px:ml-0 ml-[10%] max-768px:p-0 px-5 pt-8"
    >
      <BackButton handleBack={() => navigate(-1)} />

      <h1 className="max-768px:text-[24px] text-[34px] font-extrabold dark:text-white/90 text-gray-900 mt-8 mb-3">
        {post.title}
      </h1>

      <div className="flex items-center max-768px:gap-3 gap-4 max-768px:mb-7 mb-10">
        <Link to={`/user/${post.user.id}`}>
          <div className="max-768px:size-11 size-[50px]">
            <AvatarImage src={post.user.avatar} iconClassName="!size-10" />
          </div>
        </Link>
        <div className="flex flex-col">
          <Link to={`/user/${post.user.id}`}>
            <span className="font-semibold dark:text-white/70 text-gray-800 max-768px:text-[16px] text-lg hover:text-main dark:hover:text-main duration-300">
              {post.user.firstName} {post.user.lastName}
            </span>
          </Link>

          <span className="text-sm text-gray-500">
            {formatDate(post.createdAt)}
          </span>
        </div>
      </div>

      <div className="w-full h-[60vh] rounded-xl overflow-hidden dark:bg-white/10 bg-gray-100 flex items-center justify-center mb-5">
        <PostImage src={post.image} title="Post image" />
      </div>

      <div className="relative max-768px:mb-5 mb-7">
        <p
          ref={descriptionRef}
          className="max-768px:text-[14px] text-[17px] font-[500] dark:text-[#9f9f9f] text-gray-800 leading-relaxed overflow-hidden transition-all duration-500"
          style={{
            maxHeight,
            WebkitMaskImage:
              !isExpanded && post.description.length > 180
                ? "linear-gradient(to bottom, black 40%, transparent 100%)"
                : "none",
            maskImage:
              !isExpanded && post.description.length > 180
                ? "linear-gradient(to bottom, black 40%, transparent 100%)"
                : "none",
          }}
        >
          {post.description}
        </p>

        {!isExpanded && post.description.length > 180 && (
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center justify-center absolute -bottom-[15%] max-768px:right-[45%] right-1/2 dark:bg-[#191a1a] bg-gray-200 w-[50px] text-[30px] text-gray-600 rounded-[10px] hover:ring-2 ring-main/70 duration-300 cursor-pointer"
          >
            <IoIosArrowDown className="max-768px:text-[25px] dark:text-white/50" />
          </button>
        )}
      </div>

      <div className="flex items-center max-768px:gap-4 gap-8 dark:text-white/80 text-gray-700 max-768px:text-[18px] text-[20px] font-medium max-768px:pb-3 pb-5">
        <button
          onClick={handleToggleLike}
          className={clsx(
            "flex items-center gap-2 hover:text-main duration-300 cursor-pointer",
            liked && "text-main"
          )}
        >
          {liked ? <FaHeart /> : <FaRegHeart />}
          <span>{post.likes}</span>
        </button>
        <button
          onClick={handleToggleSave}
          className={clsx(
            "flex items-center gap-2 hover:text-main duration-300 cursor-pointer flex items-center gap-1",
            saved && "text-main"
          )}
        >
          {saved ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>

      <div className="w-full h-[1px] dark:bg-white/10 bg-gray-200 mb-5" />

      <Comments postId={id as string} />
    </motion.div>
  );
};

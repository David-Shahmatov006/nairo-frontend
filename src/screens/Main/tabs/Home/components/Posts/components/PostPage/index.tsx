import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import clsx from "clsx";
import { useNavigate, useParams } from "react-router-dom";
import { postsMock } from "../../../../../../../../constants/posts";
import { useEffect, useRef, useState } from "react";
import { BackButton } from "../../../../../../../../components/BackButton";
import { PostImage } from "../PostItem";
import { AvatarImage } from "../../../../../../../../components/AvatarImage";
import { PiShareFat } from "react-icons/pi";
import { Comments } from "./components/Comments";
import { IoIosArrowDown } from "react-icons/io";
import { useAppStore } from "../../../../../../../../stores/app";
import { motion } from "framer-motion";

export const PostPage = () => {
  const { id } = useParams();
  const { setShareOpen } = useAppStore();
  const post = postsMock.find((p) => p.id === Number(id));
  if (!post) return <div>Not found</div>;

  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const [maxHeight, setMaxHeight] = useState("100px");

  useEffect(() => {
    if (descriptionRef.current) {
      setMaxHeight(
        isExpanded ? `${descriptionRef.current.scrollHeight}px` : "100px"
      );
    }
  }, [isExpanded]);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="font-manrope min-h-screen w-full max-w-[80%] ml-[10%] px-5 pt-8"
    >
      <BackButton handleBack={() => navigate(-1)} />

      <h1 className="text-[34px] font-extrabold text-gray-900 mt-8 mb-3">
        {post.title}
      </h1>

      <div className="flex items-center gap-4 mb-10">
        <div className="size-[50px]">
          <AvatarImage src={post.image} iconClassName="!size-10" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 text-lg">
            {post.author}
          </span>
          <span className="text-sm text-gray-500">{post.date}</span>
        </div>
      </div>

      <div className="w-full h-[60vh] rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center mb-5">
        <PostImage src={post.image} title="Post image" />
      </div>

      <div className="relative mb-7">
        <p
          ref={descriptionRef}
          className="text-[17px] font-[500] text-gray-800 leading-relaxed overflow-hidden transition-all duration-500"
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
            className="flex items-center justify-center absolute -bottom-[15%] right-1/2 bg-gray-200 w-[50px] text-[30px] text-gray-600 rounded-[10px] hover:ring-2 ring-main/40 duration-300 cursor-pointer"
          >
            <IoIosArrowDown />
          </button>
        )}
      </div>

      <div className="flex items-center gap-8 text-gray-700 text-[20px] font-medium pb-5">
        <button
          onClick={handleLike}
          className={clsx(
            "flex items-center gap-2 hover:text-main duration-300 cursor-pointer",
            liked && "text-main"
          )}
        >
          {liked ? <FaHeart /> : <FaRegHeart />}
          <span>{likes}</span>
        </button>
        <button
          className={clsx(
            "hover:text-main duration-300 cursor-pointer flex items-center gap-1",
            post.saved && "text-main"
          )}
        >
          {post.saved ? <FaBookmark /> : <FaRegBookmark />}
        </button>

        <button
          onClick={() => setShareOpen(true)}
          className="flex items-center gap-1 hover:text-main duration-300 cursor-pointer"
        >
          <PiShareFat className="text-[25px]" />
        </button>
      </div>

      <div className="w-full h-[1px] bg-gray-200 mb-5" />

      <Comments />
    </motion.div>
  );
};

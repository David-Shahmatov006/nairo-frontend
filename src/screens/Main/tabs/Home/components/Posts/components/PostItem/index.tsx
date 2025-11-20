import { PiImageBroken } from "react-icons/pi";
import type { Post } from "../../../../../../../../types/post";
import {
  FaBookmark,
  FaHeart,
  FaRegBookmark,
  FaRegCommentDots,
  FaRegHeart,
  FaShare,
} from "react-icons/fa";
import clsx from "clsx";
import { useState } from "react";

interface IPostProps {
  post: Post;
  toggleLike?: (id: number) => void;
  toggleSave: (id: number) => void;
}

export const PostImage = ({ src, title }: { src: string; title: string }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-l-xl">
        <PiImageBroken size={40} className="text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      className="w-full h-full object-cover rounded-l-xl"
      onError={() => setHasError(true)}
    />
  );
};

export const PostItem = ({ post, toggleLike, toggleSave }: IPostProps) => {
  const activeTab = localStorage.getItem("activeTab");

  return (
    <div
      key={post.id}
      className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex"
    >
      <div className="flex-shrink-0 w-48 h-48 bg-gray-200">
        <PostImage src={post.image} title={post.title} />
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-center justify-between text-gray-500 text-sm">
          <span>{post.author}</span>
          <span>{post.date}</span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
        <p className="text-gray-700 text-sm">{post.description}</p>

        <div className="flex items-center justify-between mt-auto text-gray-600">
          <div className="flex items-center gap-4">
            {activeTab !== "2" && (
              <button
                onClick={() => toggleLike && toggleLike(post.id)}
                className={clsx(
                  "flex items-center gap-1 hover:text-main duration-300 cursor-pointer",
                  post.liked && "text-main"
                )}
              >
                {post.liked ? <FaHeart /> : <FaRegHeart />}
                <span>{post.likes}</span>
              </button>
            )}
            <button className="hover:text-main duration-300 cursor-pointer flex items-center gap-1">
              <FaRegCommentDots />
              <span>{post.comments}</span>
            </button>

            <button
              onClick={() => toggleSave(post.id)}
              className={clsx(
                "hover:text-main duration-300 cursor-pointer flex items-center gap-1",
                post.saved && "text-main"
              )}
            >
              {post.saved ? <FaBookmark /> : <FaRegBookmark />}
            </button>

            <button className="flex items-center gap-1 hover:text-main duration-300 cursor-pointer">
              <FaShare />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

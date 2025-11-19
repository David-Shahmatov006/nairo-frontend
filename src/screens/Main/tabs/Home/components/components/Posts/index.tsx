import { useState } from "react";
import { PiImageBroken } from "react-icons/pi";
import { motion } from "framer-motion";
import { postsMock } from "../../../../../../../constants/posts";
import { PostItem } from "./components/PostItem";

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

export const Posts = () => {
  const [posts, setPosts] = useState(postsMock);

  const toggleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const toggleSave = (id: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, saved: !post.saved } : post
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: "-20%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "-20%" }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col gap-6"
    >
      {posts.map((post) => (
        <PostItem post={post} toggleLike={toggleLike} toggleSave={toggleSave} />
      ))}
    </motion.div>
  );
};

import { postsMock } from "../../../../constants/posts";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PostItem } from "../Home/components/Posts/components/PostItem";
import surprisedMuskot from '../../../../assets/images/surprisedMuskot.webp'

const dummyPosts = [
  { id: 1, title: "My First Post", author: "John Doe" },
  { id: 2, title: "React Tips & Tricks", author: "Jane Smith" },
  { id: 3, title: "Travel Diaries", author: "Alex Johnson" },
];

export const Saved = () => {
  const [posts, setPosts] = useState(postsMock);
  const { t } = useTranslation();

  const toggleSave = (id: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, saved: !post.saved } : post
      )
    );
  };
  return (
    <div className="font-manrope p-6 flex flex-col gap-4">
      <h1 className="text-[20px] font-[600]">{t("saved.title")}</h1>
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
          posts.map((post) => (
            <PostItem
              post={post}
              toggleSave={toggleSave}
            />
          ))
        )}
      </div>
    </div>
  );
};

import { useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { NairoBalance } from "./components/NairoBalance";
import { Posts } from "../Home/components/components/Posts";
import clsx from "clsx";
import { BiMessageSquareDots } from "react-icons/bi";
import { useTranslation } from "react-i18next";

type Post = {
  id: number;
  title: string;
  description: string;
  image?: string;
};

const mockUser = {
  id: 1,
  firstName: "Alice",
  lastName: "Johnson",
  username: "alice_j",
  bio: "Frontend dev • Coffee lover • Building small social apps with soul",
  avatar: "",
  nairoBalance: 1240,
  followers: 894,
  following: 142,
  postsCount: 8,
  posts: [
    {
      id: 1,
      title: "My first Nairo post",
      description: "Sharing my progress on the new UI kit.",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 2,
      title: "Design notes",
      description: "How I approached layout and accessibility.",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 3,
      title: "Weekend trip",
      description: "Quick photos from the mountains.",
    },
  ] as Post[],
};

const currentUserId = 1;

export const Profile = () => {
  const { t } = useTranslation();

  const [user] = useState(mockUser);

  const isOwnProfile = user.id === currentUserId;

  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
  };

  return (
    <div className="font-manrope p-6">
      <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
        <div className="w-[70%] flex items-center gap-6">
          <div className="w-28 h-28 md:w-32 md:h-32 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden shadow">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.firstName} avatar`}
                className="w-full h-full object-cover"
              />
            ) : (
              <RxAvatar className="w-14 h-14 text-gray-400" />
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <span className="text-sm text-gray-500">@{user.username}</span>
            </div>

            <p className="text-sm text-gray-600 mt-2 max-w-xl">{user.bio}</p>

            {!isOwnProfile ? (
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={handleFollowToggle}
                  className={clsx(
                    "min-w-[120px] px-4 h-10 rounded-lg font-medium duration-300 cursor-pointer hover:ring-2 hover:ring-main/40",
                    isFollowing
                      ? "bg-white border border-main text-main"
                      : "bg-white border border-gray-300 text-gray-800"
                  )}
                >
                  {isFollowing ? t('profile.following') : t('profile.follow')}
                </button>

                <button className="px-4 h-10 rounded-lg bg-main/90 text-white hover:ring-2 hover:ring-main/40 duration-300 cursor-pointer">
                  <BiMessageSquareDots className="text-[20px]" />
                </button>
              </div>
            ) : (
              <button className="mt-3 px-5 py-2 rounded-lg bg-main text-white font-medium hover:bg-main/90 duration-300 w-fit cursor-pointer">
                {t("profile.edit_profile")}
              </button>
            )}
          </div>
        </div>

        <div className="w-[40%] flex gap-4 items-center">
          <div className="w-full bg-white p-4 rounded-xl shadow flex justify-between">
            <div className="flex flex-col items-center px-3">
              <span className="text-sm text-gray-500">{t('profile.followers')}</span>
              <span className="font-semibold">{user.followers}</span>
            </div>
            <div className="flex flex-col items-center px-3">
              <span className="text-sm text-gray-500">{t('profile.following')}</span>
              <span className="font-semibold">{user.following}</span>
            </div>
            <div className="flex flex-col items-center px-3">
              <span className="text-sm text-gray-500">{t('profile.posts')}</span>
              <span className="font-semibold">{user.postsCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-5">
        <Posts />
        {isOwnProfile && <NairoBalance user={user} />}
      </div>
    </div>
  );
};

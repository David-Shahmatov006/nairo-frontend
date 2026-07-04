import { useState } from "react";
import { Posts } from "../Home/components/Posts";
import clsx from "clsx";
import { BiMessageSquareDots } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { EditProfile } from "./components/EditProfile";
import { motion } from "framer-motion";
import { AvatarImage } from "../../../../components/AvatarImage";
import thinkingMuskot from "../../../../assets/images/thinkingMuskot.webp";
import { useAuthStore } from "../../../../stores/auth";
import { useNavigate, useParams } from "react-router-dom";
import { userService } from "../../../../services/user.service";
import { Loader } from "../../../../components/Loader";
import { useUser } from "../../../../hooks/useUser";
import { chatsService } from "../../../../services/chats.service";
import { FollowListModal } from "./components/FollowListModal";
import { ShowAvatarImage } from "./components/ShowAvatarImage";

export const Profile = () => {
  const { id: userIdFromUrl } = useParams();
  const navigate = useNavigate();
  const { profile, isLoading, isOwnProfile, isFollowing, mutateUser } =
    useUser(userIdFromUrl);
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const trueUserId = userIdFromUrl ?? user?.id;
  const [isEditing, setIsEditing] = useState(false);
  const [isOpenFollowModal, setIsOpenFollowModal] = useState(false);
  const [isOpenAvatarModal, setIsOpenAvatarModal] = useState(false);
  const [typeOfFollowModal, setTypeOfFollowModal] = useState("");

  const handleOpenFollowModal = (type: "followers" | "following") => {
    if (
      (type === "followers" && !profile?.followers?.length) ||
      (type === "following" && !profile?.following?.length)
    ) {
      return;
    }
    setIsOpenFollowModal(true);
    setTypeOfFollowModal(type);
  };

  const handleFollow = async () => {
    await userService.toggleFollow(userIdFromUrl!);
    mutateUser();
  };

  const handleOpenChat = async () => {
    if (!profile?.id || !user?.id) return;

    try {
      const chat = await chatsService.findChat(profile.id);

      if (chat) {
        navigate(`/chats/${chat.id}`);
        return;
      }

      navigate(`/chats/${profile.id}`);
    } catch (error) {
      console.error("Failed to get chat:", error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!profile) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3">
        <img src={thinkingMuskot} className="w-[100px]" />
        <span className="text-[17px] text-gray-500 text-center">
          {t("profile.not_found_user")}
        </span>
      </div>
    );
  }

  if (isEditing && isOwnProfile) {
    return <EditProfile onClose={() => setIsEditing(false)} />;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="font-manrope max-1024px:p-0 p-6"
      >
        <div className="flex max-620px:flex-col items-start  gap-6 mb-6">
          <div className="max-768px:w-full w-[70%] max-768px:flex-col flex items-start gap-6">
            <div className="flex items-center gap-5">
              <div>
                <button
                  onClick={() => setIsOpenAvatarModal(true)}
                  className="cursor-pointer max-768px:size-20 size-32 dark:bg-black/50 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden shadow"
                >
                  <AvatarImage src={profile.avatar || ""} />
                </button>
              </div>

              <div className="flex flex-col">
                <div className="max-768px:flex-col max-768px:items-start flex items-center max-768px:gap-0 gap-3">
                  <h1 className="[@media(min-width:1024px)_and_(max-width:1440px)]:text-[20px] text-2xl font-semibold dark:text-white/80 text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <span className="text-sm text-gray-500">
                    @{profile.username}
                  </span>
                </div>

                <p className="text-sm dark:text-[#6f6f6f] text-gray-600 mt-2 max-w-lg">
                  {profile.bio || t("profile.no_bio")}
                </p>

                <div className="max-768px:hidden">
                  {!isOwnProfile ? (
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={handleFollow}
                        className={clsx(
                          "dark:bg-white/10 bg-white border min-w-[120px] px-4 h-10 rounded-lg font-medium duration-300 hover:ring-2 hover:ring-main/70 cursor-pointer",
                          isFollowing
                            ? "border-main text-main"
                            : "dark:border-white/10 border-gray-300 dark:text-white/80 text-gray-800",
                        )}
                      >
                        {isFollowing
                          ? t("profile.following")
                          : t("profile.follow")}
                      </button>

                      <button
                        onClick={handleOpenChat}
                        className="px-4 h-10 rounded-lg bg-main/90 text-white hover:ring-2 hover:ring-main/70 duration-300 cursor-pointer"
                      >
                        <BiMessageSquareDots className="text-[20px]" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-5 font-bold rounded-lg duration-300 dark:bg-black dark:border border-white/10 bg-gray-900 text-white hover:ring-2 ring-main/70 py-3 px-6 text-base h-[48px] cursor-pointer"
                    >
                      {t("profile.edit_profile")}
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="max-768px:block hidden">
              {!isOwnProfile ? (
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={handleFollow}
                    className={clsx(
                      "dark:bg-white/10 bg-white border min-w-[120px] px-4 h-10 rounded-lg font-medium duration-300 hover:ring-2 hover:ring-main/70 cursor-pointer",
                      isFollowing
                        ? "border-main text-main"
                        : "dark:border-white/10 border-gray-300 dark:text-white/80 text-gray-800",
                    )}
                  >
                    {isFollowing ? t("profile.following") : t("profile.follow")}
                  </button>

                  <button
                    onClick={handleOpenChat}
                    className="px-4 h-10 rounded-lg bg-main/90 text-white hover:ring-2 hover:ring-main/70 duration-300 cursor-pointer"
                  >
                    <BiMessageSquareDots className="text-[20px]" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="max-768px:mt-0 mt-5 font-bold rounded-lg duration-300 dark:bg-black dark:border border-white/10 bg-gray-900 text-white hover:ring-2 ring-main/70 py-3 px-6 text-base h-[48px] cursor-pointer"
                >
                  {t("profile.edit_profile")}
                </button>
              )}
            </div>
          </div>

          <div className="max-768px:w-full w-[40%] flex gap-4 items-center">
            <div className="w-full dark:bg-white/5 dark:text-white/80 bg-white p-4 rounded-xl shadow flex justify-between">
              <div
                onClick={() => handleOpenFollowModal("followers")}
                className="cursor-pointer group flex-1 flex flex-col items-center px-3"
              >
                <span
                  className={clsx(
                    "duration-300 font-semibold",
                    profile?.followers?.length && "group-hover:text-main",
                  )}
                >
                  {profile?.followers?.length}
                </span>
                <span className="text-sm dark:text-white/30 text-gray-500">
                  {t("profile.followers")}
                </span>
              </div>

              <div
                onClick={() => handleOpenFollowModal("following")}
                className="cursor-pointer group flex flex-1 flex-col items-center px-3"
              >
                <span
                  className={clsx(
                    "duration-300 font-semibold",
                    profile?.following?.length && "group-hover:text-main",
                  )}
                >
                  {profile?.following?.length}
                </span>
                <span className="text-sm dark:text-white/30 text-gray-500">
                  {t("profile.following")}
                </span>
              </div>

              <div className="flex flex-1 flex-col items-center px-3">
                <span className="font-semibold">{profile.posts.length}</span>
                <span className="text-sm dark:text-white/30 text-gray-500">
                  {t("profile.posts")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-5">
          <Posts userId={trueUserId} mode="user" isOwnProfile={isOwnProfile} />
        </div>
      </motion.div>
      <FollowListModal
        users={
          typeOfFollowModal === "followers"
            ? profile.followers
            : profile.following
        }
        open={isOpenFollowModal}
        onClose={() => setIsOpenFollowModal(false)}
      />
      <ShowAvatarImage
        avatar={profile.avatar}
        open={isOpenAvatarModal}
        onClose={() => setIsOpenAvatarModal(false)}
      />
    </>
  );
};

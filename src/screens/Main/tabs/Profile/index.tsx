import { useState } from "react";
import { NairoBalance } from "./components/NairoBalance";
import { Posts } from "../Home/components/Posts";
import clsx from "clsx";
import { BiMessageSquareDots } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { EditProfile } from "./components/EditProfile";
import { motion } from "framer-motion";
import { AvatarImage } from "../../../../components/AvatarImage";
import { SendNairoCoinsModal } from "../../../../components/SendNairoCoinsModal";
import paperPlain from "../../../../assets/images/paperPlain.webp";
import { useAuthStore } from "../../../../stores/auth";

export const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const [isOpenSendModal, setIsOpenSendModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="p-10 text-center text-gray-500 dark:text-white/60">
        {t("profile.no_user")}
      </div>
    );
  }

  const isOwnProfile = true;

  const handleFollowToggle = () => setIsFollowing((prev) => !prev);

  if (isEditing) {
    return <EditProfile onClose={() => setIsEditing(false)} />;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="font-manrope p-6"
      >
        <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
          <div className="w-[70%] flex items-center gap-6">
            <div className="w-28 h-28 md:w-32 md:h-32 dark:bg-black/50 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden shadow">
              <AvatarImage src={user.avatar || ""} />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h1 className="text-xl md:text-2xl font-semibold dark:text-white/80 text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <span className="text-sm text-gray-500">@{user.username}</span>
              </div>

              <p className="text-sm dark:text-white/40 text-gray-600 mt-2 max-w-xl">
                {user.bio || t("profile.no_bio")}
              </p>

              {!isOwnProfile ? (
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={handleFollowToggle}
                    className={clsx(
                      "dark:bg-white/10 bg-white border min-w-[120px] px-4 h-10 rounded-lg font-medium duration-300 cursor-pointer hover:ring-2 hover:ring-main/70",
                      isFollowing
                        ? "border-main text-main"
                        : "dark:border-white/10 border-gray-300 dark:text-white/80 text-gray-800"
                    )}
                  >
                    {isFollowing ? t("profile.following") : t("profile.follow")}
                  </button>

                  <button className="px-4 h-10 rounded-lg bg-main/90 text-white hover:ring-2 hover:ring-main/70 duration-300 cursor-pointer">
                    <BiMessageSquareDots className="text-[20px]" />
                  </button>

                  <button
                    className="hover:ring-2 hover:ring-main/70 duration-300 cursor-pointer dark:bg-white/10 bg-gray-900 px-2 h-10 rounded-lg"
                    onClick={() => setIsOpenSendModal(true)}
                  >
                    <img src={paperPlain} className="w-8" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-5 flex items-center justify-center cursor-pointer font-bold rounded-lg duration-300 dark:bg-black dark:border border-white/10 bg-gray-900 text-white hover:ring-2 active:bg-gray-700 focus:ring-2 ring-main/70 py-3 px-6 text-base flex items-center h-[48px] gap-[12px]"
                >
                  {t("profile.edit_profile")}
                </button>
              )}
            </div>
          </div>

          <div className="w-[40%] flex gap-4 items-center">
            <div className="w-full dark:bg-white/5 dark:text-white/80 bg-white p-4 rounded-xl shadow flex justify-between">
              <div className="flex flex-col items-center px-3">
                <span className="text-sm dark:text-white/30 text-gray-500">
                  {t("profile.followers")}
                </span>
                <span className="font-semibold">{0}</span>
              </div>

              <div className="flex flex-col items-center px-3">
                <span className="text-sm dark:text-white/30 text-gray-500">
                  {t("profile.following")}
                </span>
                <span className="font-semibold">{0}</span>
              </div>

              <div className="flex flex-col items-center px-3">
                <span className="text-sm dark:text-white/30 text-gray-500">
                  {t("profile.posts")}
                </span>
                <span className="font-semibold">{0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-5">
          <Posts isOwnProfile={isOwnProfile} />
          {isOwnProfile && <NairoBalance />}
        </div>
      </motion.div>

      <SendNairoCoinsModal
        isOpen={isOpenSendModal}
        onClose={() => setIsOpenSendModal(false)}
        user={{
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          avatar: user.avatar,
        }}
        balance={0}
        onSend={async (amount) => {
          console.log("Sending:", amount);
          await new Promise((r) => setTimeout(r, 800));
        }}
      />
    </>
  );
};

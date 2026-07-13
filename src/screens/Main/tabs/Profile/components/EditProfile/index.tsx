import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoCameraReverseOutline } from "react-icons/io5";
import { BackButton } from "../../../../../../components/BackButton";
import { AvatarImage } from "../../../../../../components/AvatarImage";
import { useAuthStore } from "../../../../../../stores/auth";
import { userService } from "../../../../../../services/user.service";
import type { User } from "../../../../../../types/user";
import clsx from "clsx";
import { BiLoaderAlt } from "react-icons/bi";
import { mutate } from "swr";

export const EditProfile = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [error, setError] = useState("");

  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const nameRegex = /^\p{L}+$/u
  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;

  const isValidName = (value: string) =>
    value.length >= 2 && nameRegex.test(value);

  const isValidUsername = (value: string) => usernameRegex.test(value);

  const firstNameError = !isValidName(firstName)
    ? t("edit_profile.invalid_first_name")
    : "";

  const lastNameError = !isValidName(lastName)
    ? t("edit_profile.invalid_last_name")
    : "";

  const usernameError = !isValidUsername(username)
    ? t("edit_profile.invalid_username")
    : "";

  const isSaveDisabled =
    loading ||
    !isValidName(firstName) ||
    !isValidName(lastName) ||
    !isValidUsername(username);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);

    const preview = URL.createObjectURL(file);
    setAvatarUrl(preview);
  };

  const saveChanges = async () => {
    try {
      setLoading(true);

      let updatedUser: User = user as User;

      if (avatarFile) {
        const uploaded = await userService.uploadAvatar(avatarFile);
        updatedUser = uploaded;
      }

      const payload: any = {};
      if (firstName !== user?.firstName) payload.firstName = firstName;
      if (lastName !== user?.lastName) payload.lastName = lastName;
      if (username !== user?.username) payload.username = username;
      if (bio !== user?.bio) payload.bio = bio;

      if (Object.keys(payload).length > 0) {
        updatedUser = await userService.updateProfile(payload);
      }

      updateUser(updatedUser);

      await mutate(["user", user?.id]);

      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-manrope w-full max-1024px:ml-0 ml-[10%] [@media(min-width:1024px)_and_(max-width:1440px)]:max-w-[80%] max-1024px:max-w-full max-w-[70%] max-1440px:p-0 p-6 flex flex-col min-2000px:gap-[1vw] gap-6">
      <div className="flex items-center justify-between">
        <h2 className="max-768px:text-[20px] min-2000px:text-[1.1vw] text-[25px] font-semibold dark:text-white/80 text-gray-800">
          {t("edit_profile.title")}
        </h2>
        <BackButton handleBack={onClose} />
      </div>

      <div className="flex items-center min-2000px:gap-[1vw] gap-5">
        <div className="relative max-768px:size-24 min-2000px:size-[5vw] size-28">
          <AvatarImage src={avatarUrl} />

          <label
            htmlFor="avatarUpload"
            className="flex items-center justify-center absolute bottom-1 right-1 bg-gray-800 text-white min-2000px:size-[1.4vw] size-7 rounded-full cursor-pointer shadow hover:ring-2 ring-main/70 duration-300"
          >
            <IoCameraReverseOutline className="min-2000px:text-[.9vw] text-[17px]" />
          </label>

          <input
            id="avatarUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </div>

        <div className="text-gray-500 min-2000px:text-[.8vw] text-sm">
          {t("edit_profile.upload_img")}
        </div>
      </div>

      <div className="flex flex-col min-2000px:gap-[.5vw] gap-4">
        <div className="w-full max-768px:flex-col flex items-center min-2000px:gap-[.5vw] gap-4">
          <div className="w-full flex flex-col min-2000px:gap-[.2vw] gap-1">
            <label className="min-2000px:ml-[.2vw] ml-1 min-2000px:text-[.7vw] text-[14px] font-[500] text-gray-700 dark:text-white/50">
              {t("edit_profile.first_name_label")}
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={clsx(
                "font-[500] dark:bg-white/10 dark:text-white/80 bg-gray-100 min-2000px:px-[.5vw] px-4 max-768px:py-2 max-768px:text-[14px] min-2000px:text-[.8vw] min-2000px:py-[.3vw] py-2 min-2000px:rounded-[.3vw] rounded-xl outline-none focus:ring-2 ring-main/70 duration-300",
                !isValidName(firstName) && "border border-red-500"
              )}
            />
            {firstNameError && (
              <span className="text-red-500 min-2000px:text-[.7vw] text-xs">{firstNameError}</span>
            )}
          </div>

          <div className="w-full flex flex-col gap-1">
            <label className="min-2000px:ml-[.2vw] ml-1 min-2000px:text-[.7vw] text-[14px] font-[500] text-gray-700 dark:text-white/50 min-2000px:mb-[.1vw]">
              {t("edit_profile.last_name_label")}
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={clsx(
                "font-[500] dark:bg-white/10 dark:text-white/80 bg-gray-100 min-2000px:px-[.5vw] px-4 max-768px:py-2 max-768px:text-[14px] min-2000px:text-[.8vw] min-2000px:py-[.3vw] py-2 min-2000px:rounded-[.3vw] rounded-xl outline-none focus:ring-2 ring-main/70 duration-300",
                !isValidName(lastName) && "border border-red-500"
              )}
            />
            {lastNameError && (
              <span className="text-red-500 min-2000px:text-[.7vw] text-xs">{lastNameError}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="min-2000px:ml-[.2vw] ml-1 min-2000px:text-[.7vw] text-[14px] font-[500] text-gray-700 dark:text-white/50 min-2000px:mb-[.2vw]">
            {t("edit_profile.username_label")}
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={clsx(
              "font-[500] dark:bg-white/10 dark:text-white/80 bg-gray-100 min-2000px:px-[.5vw] px-4 max-768px:py-2 max-768px:text-[14px] min-2000px:text-[.8vw] min-2000px:py-[.3vw] py-2 min-2000px:rounded-[.3vw] rounded-xl outline-none focus:ring-2 ring-main/70 duration-300",
              !isValidUsername(username) && "border border-red-500"
            )}
          />
          {usernameError && (
            <span className="text-red-500 min-2000px:text-[.7vw] text-xs">{usernameError}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="min-2000px:ml-[.2vw] ml-1 min-2000px:text-[.7vw] text-[14px] font-[500] text-gray-700 dark:text-white/50 min-2000px:mb-[.2vw]">
            {t("edit_profile.bio_label")}
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="font-[500] dark:bg-white/10 dark:text-white/80 bg-gray-100 min-2000px:px-[.5vw] px-4 max-768px:py-2 max-768px:text-[14px] min-2000px:text-[.8vw] min-2000px:py-[.3vw] py-2 min-2000px:rounded-[.3vw] rounded-xl outline-none focus:ring-2 ring-main/70 duration-300 resize-none"
          ></textarea>
          <p className="text-red-500 min-2000px:text-[.7vw] font-[500]">{error}</p>
        </div>
      </div>

      <button
        onClick={saveChanges}
        disabled={isSaveDisabled}
        className={clsx(
          "w-full flex items-center justify-center cursor-pointer font-bold min-2000px:rounded-[.3vw] rounded-lg duration-300 min-2000px:py-[.4vw] py-3 min-2000px:px-[.7vw] px-6 min-2000px:text-[.8vw] text-base min-2000px:h-[2vw] h-[48px] gap-[12px] dark:bg-black/90 dark:border border-white/10 bg-gray-900 text-white hover:ring-2 active:bg-gray-700 focus:ring-2 ring-main/70",
          isSaveDisabled && "opacity-50 cursor-not-allowed hover:ring-0"
        )}
      >
        {loading ? (
          <div>
            <BiLoaderAlt className="animate-spin min-2000px:text-[1vw] text-[25px]" />
          </div>
        ) : (
          t("edit_profile.save_changes")
        )}
      </button>
    </div>
  );
};

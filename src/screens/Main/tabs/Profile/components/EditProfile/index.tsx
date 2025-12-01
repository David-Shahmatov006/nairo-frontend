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

export const EditProfile = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");

  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  // ---------- VALIDATION ----------
  const nameRegex = /^[A-Za-z]+$/;
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
    ? t("edit_profile.invalid_username") // добавь в i18n
    : "";

  const isSaveDisabled =
    loading ||
    !isValidName(firstName) ||
    !isValidName(lastName) ||
    !isValidUsername(username);

  // ---------- AVATAR UPLOAD ----------
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);

    const preview = URL.createObjectURL(file);
    setAvatarUrl(preview);
  };

  // ---------- SAVE PROFILE ----------
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

      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-manrope w-full ml-[10%] max-w-[70%] p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[25px] font-semibold dark:text-white/80 text-gray-800">
          {t("edit_profile.title")}
        </h2>
        <BackButton handleBack={onClose} />
      </div>

      {/* AVATAR */}
      <div className="flex items-center gap-5">
        <div className="relative w-28 h-28">
          <AvatarImage src={avatarUrl} />

          <label
            htmlFor="avatarUpload"
            className="flex items-center justify-center absolute bottom-1 right-1 bg-gray-800 text-white size-7 rounded-full cursor-pointer shadow hover:ring-2 ring-main/70 duration-300"
          >
            <IoCameraReverseOutline className="text-[17px]" />
          </label>

          <input
            id="avatarUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </div>

        <div className="text-gray-500 text-sm">
          {t("edit_profile.upload_img")}
        </div>
      </div>

      {/* FORM */}
      <div className="flex flex-col gap-4">
        <div className="w-full flex items-center gap-4">
          {/* First name */}
          <div className="w-full flex flex-col gap-1">
            <label className="ml-1 text-[14px] font-[500] text-gray-700 dark:text-white/50">
              {t("edit_profile.first_name_label")}
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={clsx(
                "font-[500] dark:bg-white/10 dark:text-white/80 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 ring-main/40 duration-300",
                !isValidName(firstName) && "border border-red-500"
              )}
            />
            {firstNameError && (
              <span className="text-red-500 text-xs">{firstNameError}</span>
            )}
          </div>

          {/* Last name */}
          <div className="w-full flex flex-col gap-1">
            <label className="ml-1 text-[14px] font-[500] text-gray-700 dark:text-white/50">
              {t("edit_profile.last_name_label")}
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={clsx(
                "font-[500] dark:bg-white/10 dark:text-white/80 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 ring-main/40 duration-300",
                !isValidName(lastName) && "border border-red-500"
              )}
            />
            {lastNameError && (
              <span className="text-red-500 text-xs">{lastNameError}</span>
            )}
          </div>
        </div>

        {/* Username */}
        <div className="flex flex-col gap-1">
          <label className="ml-1 text-[14px] font-[500] text-gray-700 dark:text-white/50">
            {t("edit_profile.username_label")}
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={clsx(
              "font-[500] dark:bg-white/10 dark:text-white/80 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 ring-main/40 duration-300",
              !isValidUsername(username) && "border border-red-500"
            )}
          />
          {usernameError && (
            <span className="text-red-500 text-xs">{usernameError}</span>
          )}
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-1">
          <label className="text-[14px] font-[500] text-gray-700 dark:text-white/50">
            {t("edit_profile.bio_label")}
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="font-[500] dark:bg-white/10 dark:text-white/80 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 ring-main/40 duration-300 resize-none"
          ></textarea>
        </div>
      </div>

      <button
        onClick={saveChanges}
        disabled={isSaveDisabled}
        className={clsx(
          "w-full flex items-center justify-center cursor-pointer font-bold rounded-lg duration-300 py-3 px-6 text-base h-[48px] gap-[12px]",
          "dark:bg-black/90 dark:border border-white/10 bg-gray-900 text-white",
          "hover:ring-2 active:bg-gray-700 focus:ring-2 ring-main/70",
          isSaveDisabled && "opacity-50 cursor-not-allowed hover:ring-0"
        )}
      >
        {loading ? (
          <div>
            <BiLoaderAlt className="animate-spin text-[25px]" />
          </div>
        ) : (
          t("edit_profile.save_changes")
        )}
      </button>
    </div>
  );
};

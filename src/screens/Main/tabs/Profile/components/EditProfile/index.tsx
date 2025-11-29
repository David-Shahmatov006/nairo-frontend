import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoCameraReverseOutline } from "react-icons/io5";
import { BackButton } from "../../../../../../components/BackButton";
import { AvatarImage } from "../../../../../../components/AvatarImage";

export const EditProfile = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    "https://via.placeholder.com/120"
  );
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
  };

  return (
    <div className="font-manrope w-full ml-[10%] max-w-[70%] p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[25px] font-semibold dark:text-white/80 text-gray-800">
          {t("edit_profile.title")}
        </h2>
        <BackButton handleBack={onClose} />
      </div>
      <div className="flex items-center gap-5">
        <div className="relative w-28 h-28">
          <AvatarImage src={avatarUrl!} />
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

      <div className="flex flex-col gap-4">
        <div className="w-full flex items-center gap-4">
          <div className="w-full flex flex-col gap-1">
            <label className="ml-1 text-[14px] font-[500] dark:text-white/50 text-gray-700">
              {t("edit_profile.first_name_label")}
            </label>
            <input
              type="text"
              placeholder={t("edit_profile.first_name_placeholder")}
              className="font-[500] dark:bg-white/10 dark:text-white/80 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 ring-main/40 duration-300"
            />
          </div>

          <div className="w-full flex flex-col gap-1">
            <label className="ml-1 text-[14px] font-[500] dark:text-white/50 text-gray-700">
              {t("edit_profile.last_name_label")}
            </label>
            <input
              type="text"
              placeholder={t("edit_profile.last_name_placeholder")}
              className="font-[500] dark:bg-white/10 dark:text-white/80 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 ring-main/40 duration-300"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="ml-1 text-[14px] font-[500] dark:text-white/50 text-gray-700">
            {t("edit_profile.username_label")}
          </label>
          <input
            type="text"
            placeholder={t("edit_profile.username_placeholder")}
            className="font-[500] dark:bg-white/10 dark:text-white/80 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 ring-main/40 duration-300"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[14px] font-[500] dark:text-white/50 text-gray-700">
            {t("edit_profile.bio_label")}
          </label>
          <textarea
            placeholder={t("edit_profile.bio_placeholder")}
            rows={3}
            className="font-[500] dark:bg-white/10 dark:text-white/80 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 ring-main/40 duration-300 resize-none"
          ></textarea>
        </div>
      </div>

      <button className="w-full flex items-center justify-center cursor-pointer font-bold rounded-lg duration-300 dark:bg-black/90 dark:border border-white/10 bg-gray-900 text-white hover:ring-2 active:bg-gray-700 focus:ring-2 ring-main/70 py-3 px-6 text-base flex items-center h-[48px] gap-[12px]">
        {t("edit_profile.save_changes")}
      </button>
    </div>
  );
};

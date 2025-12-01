import { useTranslation } from "react-i18next";
import { FaRegEdit } from "react-icons/fa";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { useAuthStore } from "../../../../../../stores/auth";

export const ChangeEmail = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  return (
    <div className="mb-10">
      <p className="text-[20px] font-[700] leading-[120%] dark:text-white/80 text-[#111827] mb-[32px]">
        {t("settings.change_email")}
      </p>
      <div className="dark:text-white/30 text-[#374151]/60 text-[14px] font-[500] mb-[6px]">
        {t("settings.current_mail_label")}
      </div>
      <div className="flex items-center gap-2 w-full">
        <div className="relative w-full">
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <HiOutlineEnvelope className="text-[20px] dark:text-white/50 text-black/40" />
          </div>
          <input
            type="email"
            placeholder={"your.email@example.com"}
            defaultValue={user?.email}
            className="w-full pl-10 pr-10 py-2 border dark:border-white/10 dark:text-white/80 border-[#E5E7EB] rounded-lg text-[15px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/40 duration-300"
          />

          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#374151]">
            <FaRegEdit className="text-[20px] dark:text-white/50 text-black/40" />
          </button>
        </div>
      </div>
      <button className="mt-5 min-w-[90px] px-4 h-10 rounded-lg font-[500] dark:bg-black dark:border border-white/10 bg-gray-800 text-white hover:ring-2 hover:ring-main/70 duration-300 cursor-pointer">
        {t("settings.save")}
      </button>
    </div>
  );
};

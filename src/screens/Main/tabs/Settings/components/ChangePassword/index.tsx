import { useTranslation } from "react-i18next";
import { CiLock } from "react-icons/ci";
import { LuEye } from "react-icons/lu";

export const ChangePassword = () => {
  const { t } = useTranslation();
  return (
    <>
      <p className="text-[20px] font-[700] leading-[120%] text-[#111827] mb-[32px]">
        {t("settings.change_password")}
      </p>
      <div className="mb-5">
        <div className="text-[#374151]/60 text-[14px] font-[500] mb-[6px]">
          {t("settings.old_password_label")}
        </div>
        <div className="flex items-center gap-2 w-full">
          <div className="relative w-full">
            <div className="absolute left-2 top-1/2 -translate-y-1/2">
              <CiLock className="text-[20px] text-black/40" />
            </div>
            <input
              type="email"
              className="w-full pl-10 pr-10 py-2 border border-[#E5E7EB] rounded-lg text-[15px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/40 duration-300"
              placeholder={t('password')}
            />

            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#374151]">
              <LuEye className="text-[20px] text-black/40" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="text-[#374151]/60 text-[14px] font-[500] mb-[6px]">
          {t("settings.new_password_label")}
        </div>
        <div className="flex items-center gap-2 w-full">
          <div className="relative w-full">
            <div className="absolute left-2 top-1/2 -translate-y-1/2">
              <CiLock className="text-[20px] text-black/40" />
            </div>
            <input
              type="email"
              className="w-full pl-10 pr-10 py-2 border border-[#E5E7EB] rounded-lg text-[15px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/40 duration-300"
              placeholder={t('password')}
            />

            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#374151]">
              <LuEye className="text-[20px] text-black/40" />
            </button>
          </div>
        </div>
        <p className="text-[12px] text-[#9CA3AF] mt-2">
          {t("settings.password_warning")}
        </p>
        <button className="mt-5 min-w-[90px] font-[500] px-4 h-10 rounded-lg bg-gray-800 text-white hover:ring-2 hover:ring-main/70 duration-300 cursor-pointer">
          {t("settings.save")}
        </button>
      </div>
    </>
  );
};

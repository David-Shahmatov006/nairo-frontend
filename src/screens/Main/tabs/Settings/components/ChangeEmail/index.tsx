import { useTranslation } from "react-i18next";
import { FaRegEdit } from "react-icons/fa";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { useAuthStore } from "../../../../../../stores/auth";
import { useState } from "react";
import { userService } from "../../../../../../services/user.service";
import { BiLoaderAlt } from "react-icons/bi";

export const ChangeEmail = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();

  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isValidEmail = emailRegex.test(newEmail);
  const isSameEmail = newEmail === user?.email;

  const handleUpdate = async () => {
    setError("");

    if (!isValidEmail) {
      setError(t("settings.invalid_email") || "Invalid email format");
      return;
    }

    if (isSameEmail) {
      setError(
        t("settings.same_email") || "This email is already your current one",
      );
      return;
    }

    setIsLoading(true);

    try {
      const updatedUser = await userService.changeEmail(newEmail);

      updateUser(updatedUser);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to update email";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-2000px:mb-[2.3vw] mb-10">
      <p className="min-2000px:text-[1vw] text-[20px] font-[700] leading-[120%] dark:text-white/80 text-[#111827] min-2000px:mb-[.7vw] mb-[32px]">
        {t("settings.change_email")}
      </p>

      <div className="dark:text-white/30 text-[#374151]/60 min-2000px:text-[.7vw] text-[14px] font-[500] min-2000px:mb-[.3vw] mb-[6px]">
        {t("settings.current_mail_label")}
      </div>

      <div className="flex items-center min-2000px:gap-[.2vw] gap-2 w-full">
        <div className="relative w-full">
          <div className="absolute min-2000px:left-[.3vw] left-2 top-1/2 -translate-y-1/2">
            <HiOutlineEnvelope className="min-2000px:text-[.9vw] text-[20px] dark:text-white/50 text-black/40" />
          </div>

          <input
            type="email"
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              setError("");
            }}
            className="w-full min-2000px:pl-[1.5vw] pl-10 min-2000px:pr-[1vw] pr-10 min-2000px:py-[.3vw] py-2 border dark:border-white/10 dark:text-white/80 border-[#E5E7EB] min-2000px:rounded-[.2vw] rounded-lg min-2000px:text-[.7vw] text-[15px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
          />

          <button
            onClick={handleUpdate}
            disabled={isLoading || !isValidEmail}
            className="absolute min-2000px:right-[.4vw] right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#374151] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FaRegEdit className="min-2000px:text-[.9vw] text-[20px] dark:text-white/50 text-black/40" />
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-500 min-2000px:text-[.7vw] text-sm min-2000px:mt-[.1vw] mt-2 font-[500]">
          {error}
        </p>
      )}

      <button
        onClick={handleUpdate}
        disabled={isLoading || !isValidEmail || isSameEmail}
        className="flex items-center justify-center min-2000px:mt-[.6vw] mt-5 min-2000px:min-w-[7vw] min-w-[120px] min-2000px:px-[.5vw] px-4 min-2000px:h-[1.5vw] h-10 min-2000px:rounded-[.3vw] rounded-lg font-[500] dark:bg-black dark:border border-white/10 bg-gray-800 min-2000px:text-[.8vw] text-white hover:ring-2 hover:ring-main/70 duration-300 cursor-pointer disabled:opacity-50 disabled:hover:ring-0 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <BiLoaderAlt className="animate-spin min-2000px:text-[.8vw] text-[25px]" />
        ) : (
          t("settings.save")
        )}
      </button>
    </div>
  );
};

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CiLock } from "react-icons/ci";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { userService } from "../../../../../../services/user.service";
import { BiLoaderAlt } from "react-icons/bi";
import { motion } from "framer-motion";

export const ChangePassword = () => {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  const isValidNewPassword = passwordRegex.test(newPassword);

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if (!oldPassword || !newPassword) {
      setError(t("settings.password_required") || "Fill in all fields");
      return;
    }

    if (!isValidNewPassword) {
      setError(
        t("settings.password_invalid") ||
          "Password must contain letters, numbers and be at least 6 characters long",
      );
      return;
    }

    setIsLoading(true);

    try {
      await userService.changePassword(oldPassword, newPassword);

      setSuccess(t("settings.password_changed") || "Password updated!");
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Error updating password";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <p className="min-2000px:text-[1vw] text-[20px] font-[700] leading-[120%] dark:text-white/80 text-[#111827] min-2000px:mb-[.8vw] mb-[32px]">
        {t("settings.change_password")}
      </p>

      <div className="min-2000px:mb-[.5vw] mb-5">
        <div className="dark:text-white/30 text-[#374151]/60 min-2000px:text-[.7vw] text-[14px] font-[500] min-2000px:mb-[.3vw] mb-[6px]">
          {t("settings.old_password_label")}
        </div>

        <div className="relative w-full">
          <CiLock className="absolute min-2000px:left-[.3vw] left-2 top-1/2 -translate-y-1/2 min-2000px:text-[1vw] text-[20px] dark:text-white/50 text-black/40" />

          <input
            autoComplete="old-password"
            type={oldPasswordVisible ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
              setError("");
            }}
            className="w-full min-2000px:px-[1.6vw] px-10 min-2000px:py-[.3vw] py-2 border dark:border-white/10 dark:text-white/80 border-[#E5E7EB] min-2000px:rounded-[.2vw] rounded-lg min-2000px:text-[.7vw] text-[15px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
            placeholder={t("auth.password")}
          />

          <button
            onClick={() => setOldPasswordVisible((prev) => !prev)}
            className="absolute min-2000px:right-[.3vw] right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#6B7280] group"
          >
            {oldPasswordVisible ? (
              <LuEye className="group-hover:text-main duration-300 min-2000px:text-[1vw] text-[20px] dark:text-[#6f6f6f] text-black/40" />
            ) : (
              <LuEyeClosed className="group-hover:text-main duration-300 min-2000px:text-[1vw] text-[20px] dark:text-[#6f6f6f] text-black/40" />
            )}
          </button>
        </div>
      </div>

      <div>
        <div className="dark:text-white/30 text-[#374151]/60 min-2000px:text-[.7vw] text-[14px] font-[500] min-2000px:mb-[.3vw] mb-[6px]">
          {t("settings.new_password_label")}
        </div>

        <div className="relative w-full">
          <CiLock className="absolute min-2000px:left-[.3vw] left-2 top-1/2 -translate-y-1/2 min-2000px:text-[1vw] text-[20px] dark:text-white/50 text-black/40" />

          <input
            autoComplete="new-password"
            type={newPasswordVisible ? "text" : "password"}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError("");
            }}
            className="w-full min-2000px:px-[1.6vw] px-10 min-2000px:py-[.3vw] py-2 border dark:border-white/10 dark:text-white/80 border-[#E5E7EB] min-2000px:rounded-[.2vw] rounded-lg min-2000px:text-[.7vw] text-[15px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
            placeholder={t("auth.password")}
          />

          <button
            onClick={() => setNewPasswordVisible((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#6B7280] group"
          >
            {newPasswordVisible ? (
              <LuEye className="group-hover:text-main duration-300 min-2000px:text-[1vw] text-[20px] dark:text-[#6f6f6f] text-black/40" />
            ) : (
              <LuEyeClosed className="group-hover:text-main duration-300 min-2000px:text-[1vw] text-[20px] dark:text-[#6f6f6f] text-black/40" />
            )}
          </button>
        </div>

        <p className="min-2000px:text-[.65vw] text-[12px] text-[#9CA3AF] min-2000px:mt-[.4vw] mt-2">
          {t("settings.password_warning")}
        </p>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-red-500 font-[500] min-2000px:text-[.7vw] text-sm min-2000px:mt-[.3vw] mt-2"
          >
            {error}
          </motion.p>
        )}

        {success && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-green-600 font-[500] min-2000px:text-[.7vw] text-sm min-2000px:mt-[.3vw] mt-2"
          >
            {success}
          </motion.p>
        )}

        <button
          onClick={handleChangePassword}
          disabled={
            isLoading || !oldPassword || !newPassword || !isValidNewPassword
          }
          className="flex items-center justify-center min-2000px:mt-[.6vw] mt-5 min-2000px:min-w-[7vw] min-w-[120px] min-2000px:px-[.5vw] px-4 min-2000px:h-[1.5vw] h-10 min-2000px:rounded-[.3vw] rounded-lg font-[500] dark:bg-black dark:border border-white/10 bg-gray-800 min-2000px:text-[.8vw] text-white hover:ring-2 hover:ring-main/70 duration-300 cursor-pointer disabled:opacity-50 disabled:hover:ring-0 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <BiLoaderAlt className="animate-spin text-[25px]" />
          ) : (
            t("settings.save")
          )}
        </button>
      </div>
    </div>
  );
};

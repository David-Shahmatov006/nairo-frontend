import { useState } from "react";
import { CiLock } from "react-icons/ci";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { BiLoaderAlt } from "react-icons/bi";
import { motion } from "framer-motion";
import { useAppStore } from "../../../../stores/app";
import { passwordService } from "../../../../services/password.service";
import { useTranslation } from "react-i18next";

export const NewPasswordModal = () => {
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthView, resetEmail, resetToken } = useAppStore();
  const { t } = useTranslation();

  const validatePassword = (pass: string) => {
    const hasUppercase = /[A-Z]/.test(pass);
    const hasNumber = /\d/.test(pass);
    const longEnough = pass.length >= 8;
    return hasUppercase && hasNumber && longEnough;
  };

  const handleConfirmPassword = async () => {
    setIsLoading(true);
    if (!validatePassword(password)) {
      setError(
        t('auth.password_error'),
      );
      setIsLoading(false);

      return;
    }

    try {
      await passwordService.resetPassword({
        email: resetEmail,
        newPassword: password,
        resetToken,
      });
      setAuthView("login");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full font-manrope bg-gradient-to-t from-[#8b53ff] to-transparent min-2000px:rounded-[.5vw] rounded-[16px] shadow-[0px_32px_64px_-12px_#10182824] min-2000px:p-[.07vw] p-[1.5px] relative">
      <div className="dark:bg-[#191a1a] bg-white max-1200px:p-5 min-2000px:px-[.8vw] px-7 min-2000px:py-[.5vw] py-5 min-2000px:rounded-[.4vw] rounded-[16px]">
        <h1 className="min-2000px:text-[1.3vw] text-[26px] text-center font-[600] dark:text-white/80 text-gray-900 min-2000px:mb-[.9vw] mb-8">
          {t('auth.confirm_new_password')}
        </h1>
        <div className="max-1200px:mb-2 min-2000px:mb-[.4vw] mb-3">
          <div className="flex items-center min-2000px:gap-[.3vw] gap-2 w-full">
            <div className="relative w-full">
              <div className="absolute min-2000px:left-[.3vw] left-2 top-1/2 -translate-y-1/2">
                <CiLock className="min-2000px:text-[1vw] text-[20px] dark:text-white/50 text-black/40" />
              </div>
              <input
                type={passwordVisible ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-2000px:pl-[1.5vw] pl-10 max-1200px:pr-1 min-2000px:pr-[1vw] pr-10 max-1200px:py-2 py-3 border dark:border-white/10 border-[#E5E7EB] min-2000px:rounded-[.4vw] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] max-1200px:text-[14px] min-2000px:text-[.8vw] text-[15px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
                placeholder={t('auth.password')}
              />

              <button
                onClick={() => setPasswordVisible((prev) => !prev)}
                className="cursor-pointer absolute min-2000px:right-[.4vw] right-3 top-1/2 -translate-y-1/2 text-[#6B7280] group"
              >
                {passwordVisible ? (
                  <LuEye className="group-hover:text-main duration-300 min-2000px:text-[1vw] text-[20px] dark:text-[#6f6f6f] text-black/40" />
                ) : (
                  <LuEyeClosed className="group-hover:text-main duration-300 min-2000px:text-[1vw] text-[20px] dark:text-[#6f6f6f] text-black/40" />
                )}
              </button>
            </div>
          </div>
        </div>
        <p className="min-2000px:text-[.7vw] text-[12px] dark:text-white/50 text-[#9CA3AF] max-1200px:mb-4 mb-8">
          {t('auth.password_instructions')}
        </p>
        <button
          onClick={handleConfirmPassword}
          className="group flex items-center justify-center min-2000px:gap-[.4vw] gap-3 min-2000px:min-h-[1.7vw] min-h-[48px] min-2000px:rounded-[.3vw] rounded-[12px] min-2000px:text-[.8vw] dark:bg-black/90 bg-gray-900 text-white w-full font-[500] cursor-pointer hover:opacity-70 duration-300"
        >
          {isLoading ? (
            <div>
              <BiLoaderAlt className="animate-spin min-2000px:text-[1vw] text-[25px]" />
            </div>
          ) : (
            t('auth.confirm_new_password_button')
          )}
        </button>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-red-500 font-[500] text-center max-1200px:text-[12px] min-2000px:text-[.7vw] min-2000px:mt-[.4vw] mt-3"
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  );
};

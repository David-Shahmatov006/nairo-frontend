import { useState } from "react";
import { CiLock } from "react-icons/ci";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { BiLoaderAlt } from "react-icons/bi";
import { motion } from "framer-motion";
import { useAppStore } from "../../../../stores/app";
import { passwordService } from "../../../../services/password.service";

export const NewPasswordModal = () => {
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthView, resetEmail, resetToken } = useAppStore();

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
        "Password must be at least 8 characters long, include 1 uppercase letter and 1 number.",
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
    <div className="w-full font-manrope bg-gradient-to-t from-[#8b53ff] to-transparent rounded-[16px] shadow-[0px_32px_64px_-12px_#10182824] p-[1.5px] relative">
      <div className="dark:bg-[#191a1a] bg-white max-1200px:p-5 p-[32px] sm:p-[48px] rounded-[16px]">
        <h1 className="max-1200px:text-[22px] text-[26px] text-center font-[600] dark:text-white/80 text-gray-900 max-1200px:mb-4 mb-8">
          Confirm new password
        </h1>
        <div className="max-1200px:mb-2 mb-3">
          <div className="flex items-center gap-2 w-full">
            <div className="relative w-full">
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <CiLock className="text-[20px] dark:text-white/50 text-black/40" />
              </div>
              <input
                type={passwordVisible ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 max-1200px:pr-1 pr-10 max-1200px:py-2 py-3 border dark:border-white/10 border-[#E5E7EB] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] max-1200px:text-[14px] text-[15px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
                placeholder="Password"
              />

              <button
                onClick={() => setPasswordVisible((prev) => !prev)}
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] group"
              >
                {passwordVisible ? (
                  <LuEye className="group-hover:text-main duration-300 text-[20px] dark:text-[#6f6f6f] text-black/40" />
                ) : (
                  <LuEyeClosed className="group-hover:text-main duration-300 text-[20px] dark:text-[#6f6f6f] text-black/40" />
                )}
              </button>
            </div>
          </div>
        </div>
        <p className="text-[12px] dark:text-white/50 text-[#9CA3AF] max-1200px:mb-4 mb-8">
          Use a strong password with at least 8 characters, including a mix of
          uppercase and lowercase letters and numbers.
        </p>
        <button
          onClick={handleConfirmPassword}
          className="group flex items-center justify-center gap-3 min-h-[48px] rounded-[12px] dark:bg-black/90 bg-gray-900 text-white w-full font-[500] cursor-pointer hover:opacity-70 duration-300"
        >
          {isLoading ? (
            <div>
              <BiLoaderAlt className="animate-spin text-[25px]" />
            </div>
          ) : (
            "Confirm new password"
          )}
        </button>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-red-500 font-[500] text-center max-1200px:text-[12px] mt-3"
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  );
};

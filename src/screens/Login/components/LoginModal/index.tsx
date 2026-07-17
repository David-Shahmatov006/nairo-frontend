import { useState } from "react";
import { CiLock } from "react-icons/ci";
import { FiArrowRight } from "react-icons/fi";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { authService } from "../../../../services/auth.service";
import { useAuthStore } from "../../../../stores/auth";
import { useNavigate } from "react-router-dom";
import { BiLoaderAlt } from "react-icons/bi";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "../../../../stores/app";
import { passwordService } from "../../../../services/password.service";
import { useTranslation } from "react-i18next";

export const LoginModal = () => {
  const { setUser, setToken } = useAuthStore();
  const { setAuthView, setResetEmail, resetEmail } = useAppStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(email);


  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setResetEmail(e.target.value);
  };

  const handleGenerateCode = async () => {
    setIsLoading(true);
    try {
      await passwordService.generateOTP(resetEmail);
      setAuthView("forgot-password");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    const payload = {
      email,
      password,
    };

    setIsLoading(true);
    try {
      const response = await authService.login(payload);
      setUser(response.user);
      setToken(response.accessToken);
      localStorage.setItem("token", response.accessToken);

      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message ?? t('auth.login_failed_error'));
      } else {
        setError(t('auth.something_went_wrong_error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="z-[888] w-full font-manrope bg-gradient-to-t from-[#8b53ff] to-transparent min-2000px:rounded-[.5vw] rounded-[16px] shadow-[0px_32px_64px_-12px_#10182824] min-2000px:p-[.07vw] p-[1.5px] relative">
      <div className="dark:bg-[#191a1a] bg-white max-1200px:p-5 min-2000px:px-[.8vw] px-7 min-2000px:py-[.5vw] py-5 min-2000px:rounded-[.4vw] rounded-[16px]">
        <h1 className="min-2000px:text-[1.3vw] text-[26px] text-center font-[600] dark:text-white/80 text-gray-900 min-2000px:mb-[.9vw] mb-8">
          {t('auth.login_text')}
        </h1>
        <div className="flex flex-col max-1200px:gap-3 min-2000px:gap-[.8vw] gap-7 min-2000px:mb-[.9vw] mb-8">
          <div className="flex items-center min-2000px:gap-[.3vw] gap-2 w-full">
            <div className="relative w-full">
              <div className="absolute min-2000px:left-[.2vw] left-2 top-1/2 -translate-y-1/2">
                <HiOutlineEnvelope className="min-2000px:text-[.9vw] text-[20px] dark:text-white/50 text-black/40" />
              </div>
              <input
                type="email"
                onChange={(e) => handleChangeEmail(e)}
                className="w-full min-2000px:pl-[1.5vw] pl-10 max-1200px:pr-1 min-2000px:pr-[1vw] pr-10 max-1200px:py-2 py-3 border dark:border-white/10 border-[#E5E7EB] min-2000px:rounded-[.4vw] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] min-2000px:text-[.8vw] text-[16px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
                placeholder="email@example.com"
              />
            </div>
          </div>
          <div className="flex items-center min-2000px:gap-[.3vw] gap-2 w-full">
            <div className="relative w-full">
              <div className="absolute min-2000px:left-[.2vw] left-2 top-1/2 -translate-y-1/2">
                <CiLock className="min-2000px:text-[1vw] text-[20px] dark:text-white/50 text-black/40" />
              </div>
              <input
                type={passwordVisible ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-2000px:pl-[1.5vw] pl-10 max-1200px:pr-1 min-2000px:pr-[1vw] pr-10 max-1200px:py-2 py-3 border dark:border-white/10 border-[#E5E7EB] min-2000px:rounded-[.4vw] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] min-2000px:text-[.8vw] text-[16px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
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
        <button
          onClick={handleLogin}
          className="group flex items-center justify-center min-2000px:gap-[.4vw] gap-3 min-2000px:min-h-[1.7vw] min-h-[48px] min-2000px:rounded-[.3vw] rounded-[12px] min-2000px:text-[.8vw] dark:bg-black/90 bg-gray-900 text-white w-full font-[500] cursor-pointer hover:opacity-70 duration-300"
        >
          {isLoading ? (
            <div>
              <BiLoaderAlt className="animate-spin min-2000px:text-[1vw] text-[25px]" />
            </div>
          ) : (
            <>
              {t('auth.login_button')}
              <FiArrowRight className="group-hover:translate-x-[15%] duration-300" />
            </>
          )}
        </button>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="max-1200px:text-[12px] min-2000px:text-[.7vw] font-[500] text-red-500 text-center mt-3"
            >
              {t('auth.invalid_login_error')}
            </motion.p>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isValidEmail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="w-full flex items-center justify-center max-1200px:mt-5 min-2000px:mt-[1vw] mt-10"
              onClick={handleGenerateCode}
            >
              <p className="hover:opacity-50 duration-300 cursor-pointer dark:text-white/80 max-1200px:text-[14px] cursor-pointer min-2000px:text-[.7vw] font-[700] min-2000px:mb-[.5vw] mb-[16px]">
                {t('auth.forgot_password_title')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

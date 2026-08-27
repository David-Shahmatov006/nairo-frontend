import { useState } from "react";
import { CiLock } from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { motion } from "framer-motion";
import { userService } from "../../../../services/user.service";
import { authService } from "../../../../services/auth.service";
import { useAuthStore } from "../../../../stores/auth";
import { useNavigate } from "react-router-dom";
import { BiLoaderAlt } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../../../../stores/app";
import { pickAchievementKeys } from "../../../../constants/achievements";

export const SignUpModal = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser, setToken } = useAuthStore();
  const enqueueAchievementUnlocks = useAppStore(
    (s) => s.enqueueAchievementUnlocks,
  );
  const navigate = useNavigate();
  const { t } = useTranslation();
  const language = localStorage.getItem("language");

  const validateEmail = (email: string) =>
    email.includes("@") && email.includes(".") && email.length > 5;

  const validatePassword = (pass: string) => {
    const hasUppercase = /[A-Z]/.test(pass);
    const hasNumber = /\d/.test(pass);
    const longEnough = pass.length >= 8;
    return hasUppercase && hasNumber && longEnough;
  };

  const validateUsername = (u: string) => {
    const validChars = /^[a-zA-Z0-9_]+$/.test(u);
    return u.length >= 3 && validChars;
  };

  const validateName = (name: string) => {
    const onlyLetters = /^\p{L}+$/u.test(name);

    return name.length >= 2 && onlyLetters;
  };

  const handleRegister = async () => {
    setError("");

    if (!validateName(firstName)) {
      setError(t("auth.first_name_error"));
      return;
    }

    if (!validateName(lastName)) {
      setError(t("auth.last_name_error"));
      return;
    }

    if (!validateEmail(email)) {
      setError(t("auth.email_error"));
      return;
    }

    if (!validateUsername(username)) {
      setError(t("auth.username_error"));
      return;
    }

    if (!validatePassword(password)) {
      setError(t("auth.password_error"));
      return;
    }

    if (password !== repeatPassword) {
      setError(t("auth.password_matching_error"));
      return;
    }
    try {
      setIsLoading(true);

      const response = await userService.checkUserFields(email, username);

      if (response.emailExists) {
        setError(t("auth.email_exists_error"));
        return;
      }

      if (response.usernameExists) {
        setError(t("auth.username_taken_error"));
        return;
      }
    } catch (e) {
      console.error(e);
      setError(t("auth.server_error"));
      return;
    }

    setEmail(email);
    setFirstName(firstName);
    setLastName(lastName);
    setPassword(password);
    setUsername(username);

    const payload = {
      email,
      firstName,
      lastName,
      password,
      username,
      language: language ?? "en",
    };

    try {
      const response = await authService.register(payload);
      setUser(response.user);
      setToken(response.accessToken);
      localStorage.setItem("token", response.accessToken);
      enqueueAchievementUnlocks(pickAchievementKeys(response.newlyUnlocked));

      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full font-manrope bg-gradient-to-t from-[#8b53ff] to-transparent rounded-[16px] shadow-[0px_32px_64px_-12px_#10182824] min-2000px:p-[.1vw] p-[1.5px] relative">
      <div className="dark:bg-[#191a1a] bg-white max-1200px:p-5 min-2000px:px-[.8vw] px-7 min-2000px:py-[.5vw] py-5 min-2000px:rounded-[.4vw] rounded-[16px]">
        <h1 className="min-2000px:text-[1.3vw] text-[26px] text-center font-[600] dark:text-white/80 text-gray-900 min-2000px:mb-[.9vw] mb-8">
          {t("auth.sign_up")}
        </h1>
        <div className="flex flex-col max-1200px:gap-3 min-2000px:gap-[.7vw] gap-7 max-1200px:mb-4 min-2000px:mb-[.9vw] mb-8">
          <div className="flex items-center min-2000px:gap-[.3vw] gap-2 w-full">
            <div className="relative w-full">
              <div className="absolute min-2000px:left-[.3vw] left-2 top-1/2 -translate-y-1/2">
                <HiOutlineEnvelope className="min-2000px:text-[.9vw] text-[20px] dark:text-white/50 text-black/40" />
              </div>
              <input
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="w-full min-2000px:pl-[1.5vw] pl-10 max-1200px:pr-1 min-2000px:pr-[1vw] pr-10 max-1200px:py-2 py-3 border dark:border-white/10 border-[#E5E7EB] min-2000px:rounded-[.4vw] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] min-2000px:text-[.8vw] text-[16px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
                placeholder="email@example.com"
              />
            </div>
          </div>
          <div className="w-full flex items-center min-2000px:gap-[.4vw] gap-3">
            <div className="flex items-center min-2000px:gap-[.3vw] gap-2 flex-1">
              <div className="relative w-full">
                <input
                  type="text"
                  maxLength={40}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setError("");
                  }}
                  className="w-full min-2000px:pl-[.5vw] pl-3 max-1200px:pr-1 min-2000px:pr-[1vw] pr-10 max-1200px:py-2 py-3 border dark:border-white/10 border-[#E5E7EB] min-2000px:rounded-[.4vw] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] min-2000px:text-[.8vw] text-[16px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
                  placeholder={t("auth.first_name")}
                />
              </div>
            </div>
            <div className="flex items-center min-2000px:gap-[.3vw] gap-2 flex-1">
              <div className="relative w-full">
                <input
                  type="text"
                  maxLength={40}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setError("");
                  }}
                  className="w-full min-2000px:pl-[.5vw] pl-3 max-1200px:pr-1 min-2000px:pr-[1vw] pr-10 max-1200px:py-2 py-3 border dark:border-white/10 border-[#E5E7EB] min-2000px:rounded-[.4vw] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] min-2000px:text-[.8vw] text-[16px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
                  placeholder={t("auth.last_name")}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center min-2000px:gap-[.3vw] gap-2 w-full">
            <div className="relative w-full">
              <div className="absolute min-2000px:left-[.3vw] left-2 top-1/2 -translate-y-1/2">
                <FiUser className="min-2000px:text-[.9vw] text-[20px] dark:text-white/50 text-black/40" />
              </div>
              <input
                type="text"
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                className="w-full min-2000px:pl-[1.5vw] pl-10 max-1200px:pr-1 min-2000px:pr-[1vw] pr-10 max-1200px:py-2 py-3 border dark:border-white/10 border-[#E5E7EB] min-2000px:rounded-[.4vw] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] min-2000px:text-[.8vw] text-[16px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
                placeholder={t("auth.username")}
              />
            </div>
          </div>
          <div className="flex flex-col items-center min-2000px:gap-[.3vw] gap-2 w-full">
            <div className="relative w-full">
              <div className="absolute min-2000px:left-[.3vw] left-2 top-1/2 -translate-y-1/2">
                <CiLock className="min-2000px:text-[1vw] text-[20px] dark:text-white/50 text-black/40" />
              </div>
              <input
                type={passwordVisible ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-2000px:pl-[1.5vw] pl-10 max-1200px:pr-1 min-2000px:pr-[1vw] pr-10 max-1200px:py-2 py-3 border dark:border-white/10 border-[#E5E7EB] min-2000px:rounded-[.4vw] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] min-2000px:text-[.8vw] text-[16px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
                placeholder={t("auth.password")}
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
            <p className="min-2000px:text-[.7vw] text-[12px] dark:text-white/50 text-[#9CA3AF] max-1200px:mt-0 min-2000px:mt-[.3vw] mt-2 min-2000px:mb-[.3vw]">
              {t("auth.password_instructions")}
            </p>
          </div>
          <div className="flex items-center min-2000px:gap-[.3vw] gap-2 w-full">
            <div className="relative w-full">
              <div className="absolute min-2000px:left-[.3vw] left-2 top-1/2 -translate-y-1/2">
                <CiLock className="min-2000px:text-[1vw] text-[20px] dark:text-white/50 text-black/40" />
              </div>
              <input
                type={repeatPasswordVisible ? "text" : "password"}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="w-full min-2000px:pl-[1.5vw] pl-10 max-1200px:pr-1 min-2000px:pr-[1vw] pr-10 max-1200px:py-2 py-3 border dark:border-white/10 border-[#E5E7EB] min-2000px:rounded-[.4vw] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] min-2000px:text-[.8vw] text-[16px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
                placeholder={t("auth.repeat_password")}
              />

              <button
                onClick={() => setRepeatPasswordVisible((prev) => !prev)}
                className="cursor-pointer absolute min-2000px:right-[.4vw] right-3 top-1/2 -translate-y-1/2 text-[#6B7280] group"
              >
                {repeatPasswordVisible ? (
                  <LuEye className="group-hover:text-main duration-300 min-2000px:text-[1vw] text-[20px] dark:text-[#6f6f6f] text-black/40" />
                ) : (
                  <LuEyeClosed className="group-hover:text-main duration-300 min-2000px:text-[1vw] text-[20px] dark:text-[#6f6f6f] text-black/40" />
                )}
              </button>
            </div>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-red-500 max-1200px:text-[12px] font-[500] min-2000px:text-[.7vw] text-sm mt-[-10px]"
            >
              {error}
            </motion.p>
          )}
        </div>
        <button
          type="button"
          onClick={handleRegister}
          className="group flex items-center justify-center min-2000px:gap-[.4vw] gap-3 min-2000px:min-h-[1.7vw] min-h-[48px] min-2000px:rounded-[.3vw] rounded-[12px] min-2000px:text-[.8vw] dark:bg-black/90 bg-gray-900 text-white w-full font-[500] cursor-pointer hover:opacity-70 duration-300"
        >
          {isLoading ? (
            <BiLoaderAlt className="animate-spin min-2000px:text-[1vw] text-[20px]" />
          ) : (
            t("auth.join_button")
          )}
        </button>
      </div>
    </div>
  );
};

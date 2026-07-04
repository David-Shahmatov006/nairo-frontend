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
  const navigate = useNavigate();

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
      setError(
        "First name must be at least 2 letters and contain only letters.",
      );
      return;
    }

    if (!validateName(lastName)) {
      setError(
        "Last name must be at least 2 letters and contain only letters.",
      );
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validateUsername(username)) {
      setError(
        "Username must contain at least 3 characters and include only letters, numbers, or underscores.",
      );
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long, include 1 uppercase letter and 1 number.",
      );
      return;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setIsLoading(true);

      const response = await userService.checkUserFields(email, username);

      if (response.emailExists) {
        setError("This email is already taken");
        return;
      }

      if (response.usernameExists) {
        setError("This username is already taken");
        return;
      }
    } catch (e) {
      console.error(e);
      setError("Server error, try again later.");
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
    };
    try {
      const response = await authService.register(payload);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem("token", response.token);

      navigate("/");
    } finally {
      setIsLoading(false);
      localStorage.removeItem("referralCode");
    }
  };

  return (
    <div className="w-full font-manrope bg-gradient-to-t from-[#8b53ff] to-transparent rounded-[16px] shadow-[0px_32px_64px_-12px_#10182824] p-[1.5px] relative">
      <div className="dark:bg-[#191a1a] bg-white max-1200px:p-5 p-[32px] sm:p-[48px] rounded-[16px]">
        <h1 className="dark:text-white/80 text-[26px] text-center font-[600] text-gray-900 mb-8">
          Sign Up
        </h1>
        <div className="flex flex-col max-1200px:gap-3 gap-7 max-1200px:mb-4 mb-8">
          <div className="flex items-center gap-2 w-full">
            <div className="relative w-full">
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <HiOutlineEnvelope className="text-[20px] dark:text-white/50 text-black/40" />
              </div>
              <input
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="w-full pl-10 max-1200px:pr-1 pr-10 max-1200px:py-2 py-3 border dark:border-white/10 border-[#E5E7EB] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] max-1200px:text-[14px] text-[15px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
                placeholder="your.email@example.com"
              />
            </div>
          </div>
          <div className="w-full flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative w-full">
                <input
                  type="text"
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-2 max-1200px:pr-1 max-1200px:py-2 pr-10 py-3 border dark:border-white/10 border-[#E5E7EB] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] max-1200px:text-[14px] text-[15px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
                  placeholder="First name"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <div className="relative w-full">
                <input
                  type="text"
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-2 max-1200px:pr-1 max-1200px:py-2 pr-10 py-3 border dark:border-white/10 border-[#E5E7EB] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] max-1200px:text-[14px] text-[15px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
                  placeholder="Last name"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full">
            <div className="relative w-full">
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <FiUser className="text-[20px] dark:text-white/50 text-black/40" />
              </div>
              <input
                type="text"
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                className="w-full pl-10 max-1200px:pr-1 max-1200px:py-2 pr-10 py-3 border dark:border-white/10 border-[#E5E7EB] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] max-1200px:text-[14px] text-[15px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
                placeholder="Username"
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="relative w-full">
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <CiLock className="text-[20px] dark:text-white/50 text-black/40" />
              </div>
              <input
                type={passwordVisible ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 max-1200px:pr-1 max-1200px:py-2 pr-10 py-3 border dark:border-white/10 border-[#E5E7EB] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] max-1200px:text-[14px] text-[15px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
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
            <p className="text-[12px] dark:text-white/50 text-[#9CA3AF] max-1200px:mt-0 mt-2">
              Use a strong password with at least 8 characters, including a mix
              of uppercase and lowercase letters and numbers.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full">
            <div className="relative w-full">
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <CiLock className="text-[20px] dark:text-white/50 text-black/40" />
              </div>
              <input
                type={repeatPasswordVisible ? "text" : "password"}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="w-full pl-10 max-1200px:pr-1 pr-10 max-1200px:py-2 py-3 border dark:border-white/10 border-[#E5E7EB] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] max-1200px:text-[14px] text-[15px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
                placeholder="Repeat Password"
              />

              <button
                onClick={() => setRepeatPasswordVisible((prev) => !prev)}
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] group"
              >
                {repeatPasswordVisible ? (
                  <LuEye className="group-hover:text-main duration-300 text-[20px] dark:text-[#6f6f6f] text-black/40" />
                ) : (
                  <LuEyeClosed className="group-hover:text-main duration-300 text-[20px] dark:text-[#6f6f6f] text-black/40" />
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
              className="text-red-500 max-1200px:text-[12px] font-[500] text-sm mt-[-10px]"
            >
              {error}
            </motion.p>
          )}
        </div>
        <button
          type="button"
          onClick={handleRegister}
          className="outline-none group flex items-center justify-center gap-3 min-h-[48px] rounded-[12px] dark:bg-black/80 bg-gray-900 text-white w-full font-[500] cursor-pointer hover:opacity-70 duration-300"
        >
          {isLoading ? (
            <BiLoaderAlt className="animate-spin text-[20px]" />
          ) : (
            "Join Community"
          )}
        </button>
      </div>
    </div>
  );
};

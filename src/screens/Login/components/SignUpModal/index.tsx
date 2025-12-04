import { useState } from "react";
import { CiLock } from "react-icons/ci";
import { FiArrowRight, FiUser } from "react-icons/fi";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { motion } from "framer-motion";

interface IProps {
  onNext: () => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setUsername: (value: string) => void;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
}

export const SignUpModal = ({
  onNext,
  setEmail,
  setPassword,
  setUsername,
  setFirstName,
  setLastName,
}: IProps) => {
  const [emailValue, setEmailValue] = useState("");
  const [firstNameValue, setFirstNameValue] = useState("");
  const [lastNameValue, setLastNameValue] = useState("");
  const [usernameValue, setUsernameValue] = useState("");
  const [localPassword, setLocalPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
  const [error, setError] = useState("");

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
    const onlyLetters = /^[A-Za-z]+$/.test(name);
    return name.length >= 2 && onlyLetters;
  };

  const handleNextClick = () => {
    if (!validateName(firstNameValue)) {
      setError(
        "First name must be at least 2 letters and contain only letters."
      );
      return;
    }

    if (!validateName(lastNameValue)) {
      setError(
        "Last name must be at least 2 letters and contain only letters."
      );
      return;
    }

    if (!validateEmail(emailValue)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validateUsername(usernameValue)) {
      setError(
        "Username must contain at least 3 characters and include only letters, numbers, or underscores."
      );
      return;
    }

    if (!validatePassword(localPassword)) {
      setError(
        "Password must be at least 8 characters long, include 1 uppercase letter and 1 number."
      );
      return;
    }

    if (localPassword !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    setEmail(emailValue);
    setPassword(localPassword);
    setUsername(usernameValue);
    setFirstName(firstNameValue);
    setLastName(lastNameValue);

    onNext();
  };

  return (
    <div className="w-full font-manrope bg-gradient-to-t from-[#8b53ff] to-transparent rounded-[16px] shadow-[0px_32px_64px_-12px_#10182824] p-[1.5px] relative">
      <div className="dark:bg-[#191a1a] bg-white p-[32px] sm:p-[48px] rounded-[16px]">
        <h1 className="dark:text-white/80 text-[26px] text-center font-[600] text-gray-900 mb-8">
          Sign Up
        </h1>
        <div className="flex flex-col gap-7 mb-8">
          <div className="flex items-center gap-2 w-full">
            <div className="relative w-full">
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <HiOutlineEnvelope className="text-[20px] dark:text-white/50 text-black/40" />
              </div>
              <input
                type="email"
                onChange={(e) => {
                  setEmailValue(e.target.value);
                  setError("");
                }}
                className="w-full pl-10 pr-10 py-3 border dark:border-white/10 border-[#E5E7EB] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] text-[15px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/40 duration-300"
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
                    setFirstNameValue(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-2 pr-10 py-3 border dark:border-white/10 border-[#E5E7EB] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] text-[15px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/40 duration-300"
                  placeholder="First name"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <div className="relative w-full">
                <input
                  type="text"
                  onChange={(e) => {
                    setLastNameValue(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-2 pr-10 py-3 border dark:border-white/10 border-[#E5E7EB] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] text-[15px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/40 duration-300"
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
                  setUsernameValue(e.target.value);
                  setError("");
                }}
                className="w-full pl-10 pr-10 py-3 border dark:border-white/10 border-[#E5E7EB] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] text-[15px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/40 duration-300"
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
                onChange={(e) => setLocalPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border dark:border-white/10 border-[#E5E7EB] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] text-[15px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/40 duration-300"
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
            <p className="text-[12px] dark:text-white/50 text-[#9CA3AF] mt-2">
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
                className="w-full pl-10 pr-10 py-3 border dark:border-white/10 border-[#E5E7EB] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] text-[15px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/40 duration-300"
                placeholder="Password"
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
              className="text-red-500 text-sm mt-[-10px]"
            >
              {error}
            </motion.p>
          )}
        </div>
        <button
          type="button"
          onClick={handleNextClick}
          className="outline-none group flex items-center justify-center gap-3 min-h-[48px] rounded-[12px] dark:bg-black/80 bg-gray-900 text-white w-full font-[500] cursor-pointer hover:opacity-70 duration-300"
        >
          Next step
          <FiArrowRight className="group-hover:translate-x-[15%] duration-300" />
        </button>
      </div>
    </div>
  );
};

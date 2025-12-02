import { useState } from "react";
import { CiLock } from "react-icons/ci";
import { FiArrowRight } from "react-icons/fi";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { authService } from "../../../../services/auth.service";
import { useAuthStore } from "../../../../stores/auth";
import { useNavigate } from "react-router-dom";
import { BiLoaderAlt } from "react-icons/bi";

export const LoginModal = () => {
  const { setUser, setToken } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const payload = {
      email,
      password,
    };

    setIsLoading(true);
    try {
      const response = await authService.login(payload);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem("token", response.token);

      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full font-manrope bg-gradient-to-t from-[#8b53ff] to-transparent rounded-[16px] shadow-[0px_32px_64px_-12px_#10182824] p-[1.5px] relative">
      <div className="dark:bg-[#191a1a] bg-white p-[32px] sm:p-[48px] rounded-[16px]">
        <h1 className="text-[26px] text-center font-[600] dark:text-white/80 text-gray-900 mb-8">
          Log in
        </h1>
        <div className="flex flex-col gap-7 mb-8">
          <div className="flex items-center gap-2 w-full">
            <div className="relative w-full">
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <HiOutlineEnvelope className="text-[20px] dark:text-white/50 text-black/40" />
              </div>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border dark:border-white/10 border-[#E5E7EB] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] text-[15px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/40 duration-300"
                placeholder="your.email@example.com"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 w-full">
            <div className="relative w-full">
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <CiLock className="text-[20px] dark:text-white/50 text-black/40" />
              </div>
              <input
                type={passwordVisible ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border dark:border-white/10 border-[#E5E7EB] rounded-[12px] dark:bg-white/10 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] text-[15px] dark:text-white/80 text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/40 duration-300"
                placeholder="Password"
              />

              <button
                onClick={() => setPasswordVisible((prev) => !prev)}
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] group"
              >
                {passwordVisible ? (
                  <LuEye className="group-hover:text-main duration-300 text-[20px] dark:text-white/40 text-black/40" />
                ) : (
                  <LuEyeClosed className="group-hover:text-main duration-300 text-[20px] dark:text-white/40 text-black/40" />
                )}
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogin}
          className="group flex items-center justify-center gap-3 min-h-[48px] rounded-[12px] dark:bg-black/90 bg-gray-900 text-white w-full font-[500] cursor-pointer hover:opacity-70 duration-300"
        >
          {isLoading ? (
            <div>
              <BiLoaderAlt className="animate-spin text-[25px]" />
            </div>
          ) : (
            <>
              Log in
              <FiArrowRight className="group-hover:translate-x-[15%] duration-300" />
            </>
          )}
        </button>
        <div className="w-full flex items-center justify-center mt-10">
          <p className="hover:opacity-50 duration-300 cursor-pointer dark:text-white/80 text-[16px] cursor-pointer font-[700] mb-[16px]">
            Forgot Password?
          </p>
        </div>
      </div>
    </div>
  );
};

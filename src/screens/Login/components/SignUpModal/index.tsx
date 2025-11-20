import { CiLock } from "react-icons/ci";
import { FiArrowRight } from "react-icons/fi";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { LuEye } from "react-icons/lu";

interface IProps {
  onNext: () => void;
}

export const SignUpModal = ({ onNext }: IProps) => {
  return (
    <div className="w-full font-manrope bg-gradient-to-t from-[#8b53ff] to-transparent rounded-[16px] shadow-[0px_32px_64px_-12px_#10182824] p-[1.5px] relative">
      <div className="bg-white p-[32px] sm:p-[48px] rounded-[16px]">
        <h1 className="text-[26px] text-center font-[600] text-gray-900 mb-8">
          Sign Up
        </h1>
        <div className="flex flex-col gap-7 mb-8">
          <div className="flex items-center gap-2 w-full">
            <div className="relative w-full">
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <HiOutlineEnvelope className="text-[20px] text-black/40" />
              </div>
              <input
                type="email"
                className="w-full pl-10 pr-10 py-3 border border-[#E5E7EB] rounded-[12px] bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] text-[15px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/40 duration-300"
                placeholder="your.email@example.com"
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="relative w-full">
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <CiLock className="text-[20px] text-black/40" />
              </div>
              <input
                type="email"
                className="w-full pl-10 pr-10 py-3 border border-[#E5E7EB] rounded-[12px] bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] text-[15px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/40 duration-300"
                placeholder="Password"
              />

              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#374151]">
                <LuEye className="text-[20px] text-black/40" />
              </button>
            </div>
            <p className="text-[12px] text-[#9CA3AF] mt-2">
              Use a strong password with at least 8 characters, including a mix
              of uppercase and lowercase letters, numbers, and symbols.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full">
            <div className="relative w-full">
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <CiLock className="text-[20px] text-black/40" />
              </div>
              <input
                type="email"
                className="w-full pl-10 pr-10 py-3 border border-[#E5E7EB] rounded-[12px] bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] text-[15px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-main/40 duration-300"
                placeholder="Repeat password"
              />

              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#374151]">
                <LuEye className="text-[20px] text-black/40" />
              </button>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onNext}
          className="outline-none group flex items-center justify-center gap-3 min-h-[48px] rounded-[12px] bg-gray-900 text-white w-full font-[500] cursor-pointer hover:opacity-70 duration-300"
        >
          Next step
          <FiArrowRight className="group-hover:translate-x-[15%] duration-300" />
        </button>
      </div>
    </div>
  );
};

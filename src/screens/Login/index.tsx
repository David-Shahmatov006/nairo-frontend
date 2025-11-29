import { useState } from "react";
import { LoginBackground } from "../../assets/svgComponents/LoginBackground";
import { Logo } from "../../components/Logo";
import { LoginModal } from "./components/LoginModal";
import { LoginTabs } from "./components/LoginTabs";
import { SignUpFlow } from "./components/SignUpFlow";

export const Login = () => {
  const [activeTab, setActiveTab] = useState<"signup" | "login">("login");

  return (
    <div className="relative max-w-[70%] mx-auto h-screen flex items-center justify-between">
      <LoginBackground className="absolute pointer-events-none" />
      <div className="flex w-[50%] mb-[10%] flex-col justify-center z-[2]">
        <Logo iconClassName="w-[50px]" textClassName="text-[55px]" />
        <h2 className="text-[20px] font-[700] leading-[120%] text-white/70 text-[#111827] mb-[16px]">
          Build connections, explore, and have fun.
        </h2>
        <p className=" text-white/50 text-[#3B4657] text-[16px] font-[500] leading-[150%]">
          Build your world on Nairo, share your stories, and connect with
          friends. Explore new connections, discover inspiring content, and
          reward your favorite creators with Nairo coins.
        </p>
      </div>
      <div className="w-[45%] flex flex-col items-center justify-between">
        <LoginTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "login" ? <LoginModal /> : <SignUpFlow />}
      </div>
    </div>
  );
};

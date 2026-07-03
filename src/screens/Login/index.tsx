import { LoginBackground } from "../../assets/svgComponents/LoginBackground";
import { Logo } from "../../components/Logo";
import { LoginModal } from "./components/LoginModal";
import { LoginTabs } from "./components/LoginTabs";
import { SignUpModal } from "./components/SignUpModal";
import { useAppStore } from "../../stores/app";
import { OTPModal } from "./components/OTPModal";
import { NewPasswordModal } from "./components/NewPasswordModal";

export const Login = () => {
  const { authView } = useAppStore();

  return (
    <div className="relative max-768px:max-w-full max-1024px:pt-[13%] max-w-[70%] mx-auto h-screen flex max-1024px:flex-col items-center justify-between max-768px:pb-10">
      <LoginBackground className="max-1024px:fixed absolute pointer-events-none" />
      <div className="flex max-1024px:w-[90%] w-[50%] mb-[10%] flex-col max-1024px:items-center justify-center z-[2]">
        <Logo iconClassName="[@media(min-width:1024px)_and_(max-width:1440px)]:size-10 size-[50px]" textClassName="[@media(min-width:1024px)_and_(max-width:1440px)]:text-[45px]" />
        <h2 className="max-768px:text-[15px] [@media(min-width:1024px)_and_(max-width:1440px)]:text-[18px] text-[20px] font-[700] leading-[120%] dark:text-white/70 text-[#111827] mb-[16px]">
          Build connections, explore, and have fun.
        </h2>
        <p className="dark:text-white/50 text-[#3B4657] max-1024px:text-center max-768px:text-[14px] [@media(min-width:1024px)_and_(max-width:1440px)]:text-[15px] text-[16px] font-[500] leading-[150%]">
          Build your world on Nairo, share your stories, and connect with
          friends. Explore new connections, discover inspiring content, and
          reward your favorite creators with Nairo coins.
        </p>
      </div>
      <div className="relative max-500px:!w-[93%] max-1024px:w-[70%] w-[45%] flex flex-col items-center justify-between max-768px:!justify-center max-1024px:pb-10">
        <div className="max-1024px:relative max-1024px:right-0 fixed top-[3%] right-[25%]">
          <LoginTabs />
        </div>
        {authView === "login" ? (
          <LoginModal />
        ) : authView === "signup" ? (
          <SignUpModal />
        ) : authView === "forgot-password" ? (
          <OTPModal />
        ) : (
          <NewPasswordModal />
        )}
      </div>
    </div>
  );
};

import { useAppStore } from "../../../../stores/app";

export const LoginTabs = () => {
  const {authView, setAuthView} = useAppStore()
  return (
    <div className="flex items-center dark:bg-[#272727] bg-[#F3F4F6] p-[4px] border dark:border-white/20 border-[#E5E7EB] rounded-[12px] h-[41px] mb-[48px]">
      <button
        onClick={() => setAuthView("signup")}
        className={`dark:text-white/80 text-black h-[33px] px-4 rounded-[12px] text-[14px] font-[400] transition-colors cursor-pointer ${
          authView === "signup"
            ? "dark:bg-white/20 bg-white shadow-sm"
            : "dark:hover:text-white/50 hover:text-gray-700"
        }`}
      >
        Sign up
      </button>

      <button
        onClick={() => setAuthView("login")}
        className={`dark:text-white/80 text-black h-[33px] px-4 rounded-[12px] text-[14px] font-[400] transition-colors cursor-pointer ${
          authView !== "signup"
            ? "dark:bg-white/20 bg-white shadow-sm"
            : "dark:hover:text-white/50 hover:text-gray-700 hover:text-gray-700"
        }`}
      >
        Log in
      </button>
    </div>
  );
};

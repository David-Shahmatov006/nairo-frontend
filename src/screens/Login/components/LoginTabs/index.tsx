interface LoginTabsProps {
  activeTab: "signup" | "login";
  setActiveTab: (tab: "signup" | "login") => void;
}

export const LoginTabs = ({ activeTab, setActiveTab }: LoginTabsProps) => {
  return (
    <div className="flex items-center bg-[#F3F4F6] p-[4px] border border-[#E5E7EB] rounded-[12px] h-[41px] mb-[48px]">
      <button
        onClick={() => setActiveTab("signup")}
        className={`h-[33px] px-4 rounded-[12px] text-[14px] font-[400] transition-colors cursor-pointer ${
          activeTab === "signup"
            ? "bg-white shadow-sm text-black"
            : "text-black hover:text-gray-700"
        }`}
      >
        Sign up
      </button>

      <button
        onClick={() => setActiveTab("login")}
        className={`h-[33px] px-4 rounded-[12px] text-[14px] font-[400] transition-colors cursor-pointer ${
          activeTab === "login"
            ? "bg-white shadow-sm text-black"
            : "text-black hover:text-gray-700"
        }`}
      >
        Log in
      </button>
    </div>
  );
};

import { IoAddOutline } from "react-icons/io5";
import { Logo } from "../Logo";
import { UserDropdown } from "./components/UserDropdown";
import { useEffect, useState } from "react";
import { LuSun, LuMoon } from "react-icons/lu";
import { useAppStore } from "../../stores/app";

export const Header = () => {
  const { setIsOpenPostModal } = useAppStore();

  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <header className="dark:bg-[#191a1a] z-[3] fixed top-0 left-0 w-full flex items-center justify-between bg-white dark: px-8 py-4 dark:border-white/10 border-b border-[#E5E7EB]">
      <Logo />

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="
            flex items-center justify-center size-[48px]
            rounded-lg border border-gray-300 dark:border-[gray]/50
            bg-white dark:bg-[#1a1a1a]
            hover:ring-2 ring-main/40
            duration-300 cursor-pointer
          "
        >
          {theme === "light" ? (
            <LuMoon className="text-[22px] text-gray-800" />
          ) : (
            <LuSun className="text-[22px] text-yellow-300" />
          )}
        </button>

        <button
          onClick={() => setIsOpenPostModal(true)}
          className="
            flex items-center justify-center size-[48px]
            rounded-lg border border-gray-300 dark:border-[gray]/50
            bg-white dark:bg-[#1a1a1a]
            duration-300 hover:ring-2 ring-main/40
            cursor-pointer
          "
        >
          <IoAddOutline className="text-[25px] text-main" />
        </button>

        <UserDropdown />
      </div>
    </header>
  );
};

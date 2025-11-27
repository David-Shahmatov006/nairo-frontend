import { IoAddOutline } from "react-icons/io5";
import { Logo } from "../Logo";
import { useAppStore } from "../../stores/app";
import { UserDropdown } from "./components/UserDropdown";

export const Header = () => {
  const { setIsOpenPostModal } = useAppStore();

  return (
    <header className="z-[3] fixed top-0 left-0 w-full flex items-center justify-between bg-white px-8 py-4 border-b border-[#E5E7EB]">
      <Logo />
      <div className="flex items-center gap-4">
        <button onClick={() => setIsOpenPostModal(true)} className="flex items-center justify-center font-bold rounded-lg border border-gray-300 bg-white duration-300 hover:bg-gray-50 active:bg-gray-100 focus:ring-2 focus:ring-gray-300/50 py-3 px-6 text-base outline-none flex items-center px-[12px] size-[48px] gap-[8px] cursor-pointer">
          <IoAddOutline className="text-[40px] text-main" />
        </button>
        <UserDropdown />
      </div>
    </header>
  );
};

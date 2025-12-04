import clsx from "clsx";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { CreatePostModal } from "../screens/Main/tabs/Home/components/Posts/components/CreatePostModal";
import { useLocation } from "react-router-dom";

type DashboardLayoutProps = {
  children: React.ReactNode;
};
export const MainLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();

  return (
    <>
      <div className="dark:bg-[#0f0f0f] flex flex-col h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main
            className={clsx(
              "flex-1 h-full flex flex-col  scrollbar-hidden lg:pl-[315px] overflow-auto min-h-screen",
              !location.pathname.includes('/chats') && "px-[16px] pt-[16px] sm:pt-[116px] pb-[100px] xl:pr-[100px]"
            )}
          >
            {children}
          </main>
        </div>
      </div>
      <CreatePostModal />
    </>
  );
};

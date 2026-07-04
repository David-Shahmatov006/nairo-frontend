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
      <div
        className={clsx(
          "dark:bg-[#0f0f0f] flex flex-col",
          location.pathname.includes("chats") && "h-screen",
        )}
      >
        <Header />
        <div className="flex flex-1">
          <div className="max-1024px:hidden">
            <Sidebar />
          </div>
          <main
            className={clsx(
              "flex-1 h-full flex flex-col scrollbar-hidden max-1024px:pl-0 [@media(min-width:1024px)_and_(max-width:1339px)]:pl-[250px] pl-[315px] overflow-auto min-h-screen",
              !location.pathname.includes("/chats") &&
                "max-1024px:!px-[16px] [@media(min-width:1024px)_and_(max-width:1339px)]:pr-[0px] max-768px:pt-[80px] pt-[116px] max-768px:pb-10 pb-[100px] pr-[100px]",
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

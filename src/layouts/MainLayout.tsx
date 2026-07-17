import clsx from "clsx";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { PostModal } from "../screens/Main/tabs/Home/components/Posts/components/PostModal";
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
          location.pathname.includes("chats") && "min-[768px]:h-screen",
        )}
      >
        <Header />
        <div className="flex flex-1">
          <div className="max-1024px:hidden">
            <Sidebar />
          </div>
          <main
            className={clsx(
              "flex-1 h-full flex flex-col scrollbar-hidden max-1024px:pl-0 [@media(min-width:1024px)_and_(max-width:1339px)]:pl-[250px] min-2000px:pl-[20vw] pl-[315px] overflow-auto min-h-dvh min-2000px:pt-[3.5vw]",
              !location.pathname.includes("/chats") &&
                "max-1024px:!px-[16px] [@media(min-width:1024px)_and_(max-width:1339px)]:pr-[0px] max-768px:pt-[80px] min-2000px:pt-[6vw] pt-[116px] max-768px:pb-10 pb-[100px] min-2000px:pr-[7vw] pr-[100px]",
            )}
          >
            {children}
          </main>
        </div>
      </div>
      <PostModal />
    </>
  );
};

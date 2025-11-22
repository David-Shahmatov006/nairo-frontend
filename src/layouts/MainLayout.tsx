import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { CreatePostModal } from "../screens/Main/tabs/Home/components/Posts/components/CreatePostModal";

type DashboardLayoutProps = {
  children: React.ReactNode;
  // activeTab: number;
  // setActiveTab: (index: number) => void;
};
export const MainLayout = ({
  children,
  // activeTab,
  // setActiveTab,
}: DashboardLayoutProps) => {
  return (
    <>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 h-full flex flex-col px-[16px]  scrollbar-hidden lg:pl-[315px] xl:pr-[100px] pt-[16px] sm:pt-[116px] pb-[100px] overflow-auto min-h-screen">
            {children}
          </main>
        </div>
      </div>
      <CreatePostModal />
    </>
  );
};

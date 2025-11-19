import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 h-full flex flex-col px-[16px]  scrollbar-hidden lg:pl-[225px] xl:pr-[170px] pt-[16px] sm:pt-[116px] pb-0 overflow-auto min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};


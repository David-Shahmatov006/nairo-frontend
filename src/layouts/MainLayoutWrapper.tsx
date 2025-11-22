import { Outlet } from "react-router-dom";
import { MainLayout } from "./MainLayout";

export const MainLayoutWrapper = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

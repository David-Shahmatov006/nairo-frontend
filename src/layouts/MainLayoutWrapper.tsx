import { Outlet, useLocation } from "react-router-dom";
import { MainLayout } from "./MainLayout";
import { useEffect } from "react";
import { useWindowSize } from "usehooks-ts";

export const MainLayoutWrapper = () => {
  const location = useLocation();
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  useEffect(() => {
    if (
      location.pathname.includes("chats") ||
      (location.pathname.includes("profile") && !isMobile) ||
      location.pathname.includes("user")
    ) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [location.pathname, isMobile]);

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

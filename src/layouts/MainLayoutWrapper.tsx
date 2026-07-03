import { Outlet, useLocation } from "react-router-dom";
import { MainLayout } from "./MainLayout";
import { useEffect } from "react";
import { useWindowSize } from "usehooks-ts";

export const MainLayoutWrapper = () => {
  const location = useLocation();
  const { width } = useWindowSize();
  const isMobile = width <= 768

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
  }, [location]);

  useEffect(() => {
    if (width > 992) {
      return;
    }

    const handleScroll = () => {
      const element = document.querySelector(".chat-scroll-container > div");
      if (!element || window.innerWidth > 992) {
        return;
      }
    };

    const element = document.querySelector(".chat-scroll-container > div");

    if (element) {
      element?.addEventListener("scroll", handleScroll);
    } else {
      const timeout = setTimeout(() => {
        const element = document.querySelector(".chat-scroll-container > div");
        element?.addEventListener("scroll", handleScroll);
      }, 3000);

      return () => {
        timeout && clearTimeout(timeout);
        const element = document.querySelector(".chat-scroll-container > div");
        element?.removeEventListener("scroll", handleScroll);
      };
    }

    return () => {
      const element = document.querySelector(".chat-scroll-container > div");
      element?.removeEventListener("scroll", handleScroll);
    };
  }, [width]);

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

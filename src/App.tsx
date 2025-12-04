import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
// import { Main } from "./screens/Main";
import "./i18n";
import { Login } from "./screens/Login";
import { PostPage } from "./screens/Main/tabs/Home/components/Posts/components/PostPage";
import { MainLayoutWrapper } from "./layouts/MainLayoutWrapper";
import { Shop } from "./screens/Shop";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "./stores/app";
import { ROUTES } from "./routes";
import { Snowfall } from "./components/Snowfall";
import { SharePostModal } from "./screens/Main/tabs/Home/components/SharePostModal";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Profile } from "./screens/Main/tabs/Profile";
import { Home } from "./screens/Main/tabs/Home";
import { Search } from "./screens/Main/tabs/Search";
import { Chats } from "./screens/Main/tabs/Chats";
import { Saved } from "./screens/Main/tabs/Saved";
import { Settings } from "./screens/Main/tabs/Settings";
import { useAuthStore } from "./stores/auth";
import { useTranslation } from "react-i18next";
import { LANGS } from "./constants/langs";

const NavigationWatcher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeTab } = useAppStore();
  const previousTabRef = useRef(activeTab);

  useEffect(() => {
    const isNestedPage =
      location.pathname.startsWith("/post/") ||
      location.pathname.startsWith("/user") ||
      location.pathname.startsWith("/shop");

    if (previousTabRef.current !== activeTab && isNestedPage) {
      navigate(-1);
    }

    previousTabRef.current = activeTab;
  }, [activeTab, navigate, location.pathname]);

  return null;
};

function App() {
  const { shareOpen, setShareOpen, theme } = useAppStore();
  const { user } = useAuthStore();
  const { setSelectedLanguage } = useAppStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLang =
      user?.preferredLanguage || localStorage.getItem("language") || "en";

    const langObj = LANGS.find((l) => l.code === savedLang);

    if (langObj) {
      setSelectedLanguage(langObj);
      i18n.changeLanguage(savedLang);
    }
  }, [user]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <Router>
      <Snowfall />

      <Routes>
        {/* публичный */}
        <Route path={ROUTES.LOGIN} element={<Login />} />

        {/* защищённый layout */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayoutWrapper />
            </ProtectedRoute>
          }
        >
          {/* главные страницы */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />

          {/* вложенные */}
          <Route path="/user/:id" element={<Profile />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/shop" element={<Shop />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

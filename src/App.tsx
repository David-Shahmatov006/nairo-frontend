import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./i18n";
import { Login } from "./screens/Login";
import { PostPage } from "./screens/Main/tabs/Home/components/Posts/components/PostPage";
import { MainLayoutWrapper } from "./layouts/MainLayoutWrapper";
import { useEffect } from "react";
import { useAppStore } from "./stores/app";
import { ROUTES } from "./routes";
// TODO: UNCOMMENT IN WINTER
// import { Snowfall } from "./components/Snowfall";
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
import { ScrollToTop } from "./components/ScrollToTop";

function App() {
  const { theme } = useAppStore();
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("refCode");

    if (ref) {
      localStorage.setItem("referralCode", ref);
    }
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <MainLayoutWrapper />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/chats/:chatId?" element={<Chats />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user/:id" element={<Profile />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

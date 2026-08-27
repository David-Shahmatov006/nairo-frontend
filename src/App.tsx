import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./i18n";
import { MainLayoutWrapper } from "./layouts/MainLayoutWrapper";
import { useEffect } from "react";
import { useAppStore } from "./stores/app";
import { ROUTES } from "./routes";
// TODO: UNCOMMENT IN WINTER
// import { Snowfall } from "./components/Snowfall";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuthStore } from "./stores/auth";
import { useTranslation } from "react-i18next";
import { LANGS } from "./constants/langs";
import { ScrollToTop } from "./components/ScrollToTop";
import { Login } from "./screens/Login";
import { Home } from "./screens/Main/tabs/Home";
import { Search } from "./screens/Main/tabs/Search";
import { Chats } from "./screens/Main/tabs/Chats";
import { Saved } from "./screens/Main/tabs/Saved";
import { Settings } from "./screens/Main/tabs/Settings";
import { Profile } from "./screens/Main/tabs/Profile";
import { PostPage } from "./screens/Main/tabs/Home/components/Posts/components/PostPage";
import { NotFound } from "./screens/NotFound";
import { AchievementUnlockModal } from "./components/AchievementUnlockModal";

function App() {
  const theme = useAppStore((s) => s.theme);
  const setSelectedLanguage = useAppStore((s) => s.setSelectedLanguage);
  const preferredLanguage = useAuthStore((s) => s.user?.preferredLanguage);
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLang =
      preferredLanguage || localStorage.getItem("language") || "en";

    const langObj = LANGS.find((l) => l.code === savedLang);

    if (langObj) {
      setSelectedLanguage(langObj);
      i18n.changeLanguage(savedLang);
    }
  }, [preferredLanguage, setSelectedLanguage, i18n]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

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
          <Route path="/chats/:chatId?" element={<Chats />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user/:id" element={<Profile />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AchievementUnlockModal />
    </Router>
  );
}

export default App;

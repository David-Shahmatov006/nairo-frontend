import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { Main } from "./screens/Main";
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
  const [users] = useState([
    { id: 1, name: "Alice Johnson", username: "alice_j" },
    { id: 2, name: "Mark Smith", username: "mark_s" },
    { id: 3, name: "Julia Adams", username: "julia_ad" },
  ]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <Router>
      <NavigationWatcher />
      <Snowfall />

      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayoutWrapper />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.HOME} element={<Main />} />
          <Route path={ROUTES.SHOP} element={<Shop />} />
          <Route path="/user/:id" element={<Profile />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Route>
      </Routes>
      <SharePostModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        onSend={() => {
          setShareOpen(false);
        }}
        users={users}
      />
    </Router>
  );
}

export default App;

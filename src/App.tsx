import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
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

const NavigationWatcher = () => {
  const navigate = useNavigate();
  const { activeTab } = useAppStore();
  const previousTabRef = useRef(activeTab);

  useEffect(() => {
    if (previousTabRef.current !== activeTab) {
      navigate(-1);
    }
    previousTabRef.current = activeTab;
  }, [activeTab, navigate]);

  return null;
};

function App() {
  const { shareOpen, setShareOpen } = useAppStore();
  const [users] = useState([
    { id: 1, name: "Alice Johnson", username: "alice_j" },
    { id: 2, name: "Mark Smith", username: "mark_s" },
    { id: 3, name: "Julia Adams", username: "julia_ad" },
  ]);
  
  return (
    <Router>
      <NavigationWatcher />
      <Snowfall />

      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />

        <Route element={<MainLayoutWrapper />}>
          <Route path={ROUTES.HOME} element={<Main />} />
          <Route path={ROUTES.SHOP} element={<Shop />} />
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

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
import { useEffect, useRef } from "react";
import { useAppStore } from "./stores/app";
import { ROUTES } from "./routes";

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
  return (
    <Router>
      <NavigationWatcher />

      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />

        <Route element={<MainLayoutWrapper />}>
          <Route path={ROUTES.HOME} element={<Main />} />
          <Route path={ROUTES.SHOP} element={<Shop />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

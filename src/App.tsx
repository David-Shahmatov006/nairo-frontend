import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Main } from "./screens/Main";
import "./i18n";
import { Login } from "./screens/Login";
import { PostPage } from "./screens/Main/tabs/Home/components/Posts/components/PostPage";
import { MainLayoutWrapper } from "./layouts/MainLayoutWrapper";

function App() {
  return (
    <Router>
      <Routes>
        {/* Страница без layout */}
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayoutWrapper />}>
          <Route path="/" element={<Main />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

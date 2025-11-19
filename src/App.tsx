import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./screens/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

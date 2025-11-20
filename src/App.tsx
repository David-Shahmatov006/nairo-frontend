import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Main } from "./screens/Main";
import './i18n'
import { Login } from "./screens/Login";

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Main />}/>
          <Route path="/login" element={<Login />}/>
      </Routes>
    </Router>
  );
}

export default App;

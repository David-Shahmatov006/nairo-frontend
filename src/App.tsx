import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Main } from "./screens/Main";
import './i18n'

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Main />}/>
      </Routes>
    </Router>
  );
}

export default App;

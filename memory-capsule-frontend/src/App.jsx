import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import CapsuleFormPage from "./pages/CapsuleFormPage.jsx";
import Header from "./components/header.jsx";

function App() {
  return (
    <Router>
      <div className="sourcesans">
        <Header />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<CapsuleFormPage />} />
          <Route path="/edit/:id" element={<CapsuleFormPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

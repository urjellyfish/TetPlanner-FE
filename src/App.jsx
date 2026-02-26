import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/auth/SignUp.jsx";
import VerifyEmail from "./pages/auth/VerifyEmail.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

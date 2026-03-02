import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";

// Components & Pages
import SideBar from "./components/SideBar";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Shopping from "./pages/Shopping";
import Calendar from "./pages/Calendar";
import SignUp from "./pages/auth/SignUp.jsx";
import VerifyEmail from "./pages/auth/VerifyEmail.jsx";
import LoginForm from "./pages/auth/Login.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import ResetPassSuccess from "./pages/auth/ResetPassSuccess.jsx";
import useTheme from "./hooks/useTheme.jsx";
import FallingTheme from "./components/FallingTheme.jsx";
import { useAuth } from "./hooks/useAuth.jsx";

function App() {
  const { token } = useAuth();
  const { flowerIcon } = useTheme("default");

  return (
    <div className="w-full h-screen flex bg-(--color-bg-app) text-(--color-text-primary) transition-colors duration-200">
      {token ? (
        <>
          <SideBar />
          <FallingTheme flowerIcon={flowerIcon} />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/shopping" element={<Shopping />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-success" element={<ResetPassSuccess />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="colored"
      />
    </div>
  );
}

export default App;

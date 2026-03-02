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
import LoginForm from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ResetPassSuccess from "./pages/auth/ResetPassSuccess";
import TaskProvider from "./contexts/TaskProvider";
import DashboardProvider from "./contexts/DashboardProvider";
import { useAuth } from "./hooks/useAuth";
import useTheme from "./hooks/useTheme";

function App() {
  const { token } = useAuth();
  const { flowerIcon } = useTheme("default");

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-success" element={<ResetPassSuccess />} />
        <Route
          path="/*"
          element={
            <div className="w-full h-screen flex bg-(--color-bg-main)">
              <SideBar />
              <TaskProvider>
                <Routes>
                  <Route
                    path="/dashboard"
                    element={
                      <DashboardProvider>
                        <Dashboard />
                      </DashboardProvider>
                    }
                  />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/shopping" element={<Shopping />} />
                  <Route path="/calendar" element={<Calendar />} />
                </Routes>
              </TaskProvider>
            </div>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="colored"
      />
    </>
  );
}

export default App;

import { Route, Routes } from "react-router-dom";
import "./App.css";
import SideBar from "./components/SideBar";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Shopping from "./pages/Shopping";
import Calendar from "./pages/Calendar";

function App() {
  return (
    <div className="w-full h-screen flex bg-(--color-bg-main)">
      <SideBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/shopping" element={<Shopping />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </div>
  );
}

export default App;

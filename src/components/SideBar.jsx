import React from "react";
import TetPlaner from "./TetPlanner";
import SideBarButton from "./SideBarButton";
import { RiDashboardFill } from "react-icons/ri";
import { RiTaskFill } from "react-icons/ri";
import { RiWallet3Fill } from "react-icons/ri";
import { FaCalendarAlt } from "react-icons/fa";
import ThemeButton from "./ThemeButton";
import ProfileButton from "./ProfileButton";
import TetPlanner from "./TetPlanner";

const SideBar = () => {
  return (
    <div className="w-64 shrink-0 h-full p-4 flex flex-col bg-(--color-bg-sidebar) border-r border-(--color-border-light) caret-transparent">
      {/* Top of sidebar */}
      <div className="w-full flex flex-col gap-4">
        <TetPlanner />

        <nav className="flex flex-col gap-2 mt-4">
          <SideBarButton icon={RiDashboardFill} content="Dashboard" to="/" />
          <SideBarButton icon={RiTaskFill} content="Task" to="/tasks" />
          <SideBarButton
            icon={RiWallet3Fill}
            content="Shopping & Budget"
            to="/shopping"
          />
          <SideBarButton
            icon={FaCalendarAlt}
            content="Calendar"
            to="/calendar"
          />
        </nav>
      </div>
      {/* Bottom of sidebar */}
      <div className="mt-auto">
        <ThemeButton />
        <ProfileButton name="John Doe" />
      </div>
    </div>
  );
};

export default SideBar;

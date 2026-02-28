import React from "react";
import { NavLink } from "react-router-dom";

const SideBarButton = ({ icon: Icon, content, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `w-full
        flex items-center justify-start gap-2
        px-2
        h-12
        rounded-xl
        transition-all duration-200
        caret-transparent
        ${
          isActive
            ? "text-(--color-primary-500) bg-(--color-primary-300)/25"
            : "text-(--color-text-muted) hover:text-(--color-text-primary) "
        }
        `
      }
    >
      {Icon && <Icon className="text-xl" />}
      <span className="font-medium">{content}</span>
    </NavLink>
  );
};

export default SideBarButton;

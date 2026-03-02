import React from "react";
import { BiSolidMoon } from "react-icons/bi";
import ThemeList from "./ThemeList";

const ThemeButton = () => {
  return (
    <>
      <div className="group w-full h-12 px-2 relative flex items-center justify-start gap-2 text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors duration-200 cursor-pointer">
        <BiSolidMoon className="text-2xl" />
        <span>Theme</span>

        <div className="absolute bottom-full left-0  duration-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
          <ThemeList />
        </div>
      </div>
    </>
  );
};

export default ThemeButton;

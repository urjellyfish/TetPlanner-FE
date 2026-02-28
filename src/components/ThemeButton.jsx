import React from "react";
import { BiSolidMoon } from "react-icons/bi";

const ThemeButton = () => {
  return (
    <div className="w-full h-12 px-2 flex items-center justify-start gap-2 text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors duration-200 cursor-pointer">
      <BiSolidMoon className="text-2xl" />
      <span>Theme</span>
    </div>
  );
};

export default ThemeButton;

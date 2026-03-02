import React from "react";
import useTheme from "../hooks/useTheme";

const ThemeList = () => {
  const { theme, flowerIcon, changeTheme, changeFlowerIcon } = useTheme();

  return (
    <div className="w-full flex flex-col justify-center items-start p-2 gap-1 bg-(--color-bg-main) rounded-md shadow-lg text-sm">
      <p
        className={`w-full text-left cursor-pointer p-2 rounded-md transition-colors duration-200 ${
          theme === "default"
            ? "bg-(--color-primary-300)/25 text-(--color-primary-500)"
            : "bg-transparent text-(--color-text-muted) hover:text-(--color-text-primary)"
        }`}
        onClick={() => changeTheme("default")}
      >
        Light-Pink
      </p>

      <p
        className={`w-full text-left cursor-pointer p-2 rounded-md transition-colors duration-200 ${
          theme === "cherry-pink"
            ? "bg-(--color-primary-300)/25 text-(--color-primary-500)"
            : "bg-transparent text-(--color-text-muted) hover:text-(--color-text-primary)"
        }`}
        onClick={() => changeTheme("cherry-pink")}
      >
        Dark-Pink
      </p>

      <p
        className={`w-full text-left cursor-pointer p-2 rounded-md transition-colors duration-200 ${
          theme === "apricot-yellow"
            ? "bg-(--color-primary-300)/25 text-(--color-primary-500)"
            : "bg-transparent text-(--color-text-muted) hover:text-(--color-text-primary)"
        }`}
        onClick={() => changeTheme("apricot-yellow")}
      >
        Apricot-yellow
      </p>

      {/* --- Cho nay la ICON --- */}
      <p
        className={`w-full text-left cursor-pointer p-2 rounded-md transition-colors duration-200 ${
          flowerIcon === "default"
            ? "bg-(--color-primary-300)/25 text-(--color-primary-500)"
            : "bg-transparent text-(--color-text-muted) hover:text-(--color-text-primary)"
        }`}
        onClick={() => changeFlowerIcon("default")}
      >
        None-icon
      </p>

      <p
        className={`w-full text-left cursor-pointer p-2 rounded-md transition-colors duration-200 ${
          flowerIcon === "🌸"
            ? "bg-(--color-primary-300)/25 text-(--color-primary-500)"
            : "bg-transparent text-(--color-text-muted) hover:text-(--color-text-primary)"
        }`}
        onClick={() => changeFlowerIcon("🌸")}
      >
        Peach Blossom
      </p>

      <p
        className={`w-full text-left cursor-pointer p-2 rounded-md transition-colors duration-200 ${
          flowerIcon === "🧧"
            ? "bg-(--color-primary-300)/25 text-(--color-primary-500)"
            : "bg-transparent text-(--color-text-muted) hover:text-(--color-text-primary)"
        }`}
        onClick={() => changeFlowerIcon("🧧")}
      >
        Red Envelope
      </p>
    </div>
  );
};

export default ThemeList;

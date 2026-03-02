import { useState, useEffect } from "react";
import ThemeContext from "./ThemeContext";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "default";
  });

  const [flowerIcon, setFlowerIcon] = useState(() => {
    return localStorage.getItem("flowerIcon") || "default";
  });

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const changeFlowerIcon = (newIcon) => {
    setFlowerIcon(newIcon);
    localStorage.setItem("flowerIcon", newIcon);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        flowerIcon,
        changeTheme,
        changeFlowerIcon,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

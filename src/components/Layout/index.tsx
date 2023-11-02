import React, { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Apply the theme
  useEffect(() => {
    const body = document.body;
    const toggle = darkMode ? "dark" : "light";
    body.setAttribute("data-theme", toggle);
  }, [darkMode]);

  return (
    <div className="layout">
      <div
        onClick={toggleDarkMode}
        className="layout__dark-mode-toggle">
        {darkMode ? <FaSun /> : <FaMoon />}
      </div>
      <div className="layout__main">{children}</div>
    </div>
  );
};

export default Layout;

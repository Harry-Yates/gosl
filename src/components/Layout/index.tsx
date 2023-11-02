import React, { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Initialize darkMode state from localStorage or default to true
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("darkMode");
      return savedMode === "true" ? true : savedMode === "false" ? false : true; // default to true if not set
    }
    return true; // default to true if window is not defined
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Save the new state to localStorage
    localStorage.setItem("darkMode", (!darkMode).toString());
  };

  // Apply the theme
  useEffect(() => {
    const body = document.body;
    const toggle = darkMode ? "dark" : "light";
    body.setAttribute("data-theme", toggle);
    // Save the current state to localStorage
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <div className="layout">
      <div
        onClick={toggleDarkMode}
        className="layout__dark-mode-toggle"
        role="button" // Accessibility improvement
        aria-pressed={darkMode} // Accessibility improvement
        tabIndex={0} // Accessibility improvement
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </div>
      <div className="layout__main">{children}</div>
    </div>
  );
};

export default Layout;

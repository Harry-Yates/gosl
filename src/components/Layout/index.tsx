import React, { useState, useEffect } from "react";
import { FaMoon, FaSun, FaCog, FaTrash } from "react-icons/fa";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Initialize darkMode state from localStorage or default to true
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("darkMode");
      return savedMode === "true" ? true : savedMode === "false" ? false : true; // default to true if not set
    }
    return true; // default to true if window is not defined
  });

  // Initialize showDeleteMe state to true to match server-rendered content
  const [showDeleteMe, setShowDeleteMe] = useState<boolean>(true);

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

  // Update showDeleteMe based on localStorage after component mounts
  useEffect(() => {
    const savedVisibility = localStorage.getItem("showDeleteMe");
    setShowDeleteMe(savedVisibility !== "false");
  }, []);

  // Handle click to hide the "delete me" section
  const handleDeleteMeClick = () => {
    setShowDeleteMe(false);
    localStorage.setItem("showDeleteMe", "false");
  };

  return (
    <div className="layout">
      <div className="layout__container">
        {showDeleteMe && (
          <header className="layout__header">
            <div className="layout__title">
              <h1>GoSL</h1>
              <br />
              <span>
                <span className="color-green">Departure </span>
                <span className="color-yellow">Traffic </span>
                <span className="color-red">Light</span>
              </span>
            </div>
            <p>
              Click the settings icon <FaCog />
            </p>
            <p>
              Choose a Stockholm tube stop, input your walk time in minutes, and
              filter your train options.
            </p>
            <br />
            <p>Missed train: Red</p>
            <p>Get ready: Yellow</p>
            <p>Go time: Green</p>
            <br />
            <p>
              Click the bin{" "}
              <FaTrash
                className="layout__trash"
                onClick={handleDeleteMeClick}
              />{" "}
              and delete instructions.
            </p>
          </header>
        )}
        <div
          onClick={toggleDarkMode}
          className="layout__dark-mode-toggle"
          role="button"
          aria-pressed={darkMode}
          tabIndex={0}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </div>
        <div className="layout__main">{children}</div>
      </div>
    </div>
  );
};

export default Layout;

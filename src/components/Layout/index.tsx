import React, { useState, useEffect } from "react";
import { FaMoon, FaSun, FaCog, FaTrash } from "react-icons/fa";
import { HiOutlineTrash } from "react-icons/hi";
import { MdOutlineResetTv } from "react-icons/md";

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
    localStorage.setItem("darkMode", (!darkMode).toString());
  };

  const resetLocalStorage = () => {
    localStorage.clear();
    setDarkMode(true);
    setShowDeleteMe(true);
    window.location.reload();
  };

  useEffect(() => {
    const body = document.body;
    const toggle = darkMode ? "dark" : "light";
    body.setAttribute("data-theme", toggle);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    const savedVisibility = localStorage.getItem("showDeleteMe");
    setShowDeleteMe(savedVisibility !== "false");
  }, []);

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
              <span>
                <span className="color-green">Departure </span>
                <span className="color-yellow">Traffic </span>
                <span className="color-red">Light</span>
              </span>
            </div>
            <br />
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
              <HiOutlineTrash
                className="layout__trash"
                onClick={handleDeleteMeClick}
              />{" "}
              and delete instructions.
            </p>
          </header>
        )}
        <div className="layout__controls">
          {/* <div
            onClick={toggleDarkMode}
            className="icon layout__dark-mode-toggle"
            role="button"
            aria-pressed={darkMode}
            tabIndex={0}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </div> */}
          <MdOutlineResetTv
            className="icon layout__reset-icon"
            onClick={resetLocalStorage}
            role="button"
            tabIndex={0}
            title="Reset Settings"
          />
        </div>
        <div className="layout__main">{children}</div>
      </div>
    </div>
  );
};

export default Layout;

import React, { createContext, useContext, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * Dark Mode Context and Provider
 * Provides dark mode support across the application
 */

const DarkModeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

export const useDarkMode = () => useContext(DarkModeContext);

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage or system preference
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // Update document class and save preference
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const DarkModeToggle = ({ className = "" }) => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 ${
        darkMode
          ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      } ${className}`}
      aria-label="Toggle dark mode"
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-6 h-6">
        <Sun
          className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
            darkMode
              ? "opacity-0 rotate-180 scale-0"
              : "opacity-100 rotate-0 scale-100"
          }`}
        />
        <Moon
          className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
            darkMode
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-180 scale-0"
          }`}
        />
      </div>
    </button>
  );
};

export const DarkModeToggleSwitch = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="flex items-center space-x-3">
      <Sun
        className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-yellow-500"}`}
      />
      <button
        onClick={toggleDarkMode}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
          darkMode ? "bg-purple-600" : "bg-gray-300"
        }`}
        aria-label="Toggle dark mode"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
            darkMode ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <Moon
        className={`w-5 h-5 ${darkMode ? "text-purple-400" : "text-gray-400"}`}
      />
    </div>
  );
};

// Dark mode utility class mappings
export const darkClasses = {
  // Backgrounds
  bgPrimary: "bg-white dark:bg-gray-900",
  bgSecondary: "bg-gray-50 dark:bg-gray-800",
  bgTertiary: "bg-gray-100 dark:bg-gray-700",

  // Text colors
  textPrimary: "text-gray-900 dark:text-gray-100",
  textSecondary: "text-gray-600 dark:text-gray-400",
  textTertiary: "text-gray-500 dark:text-gray-500",

  // Borders
  border: "border-gray-200 dark:border-gray-700",
  borderLight: "border-gray-100 dark:border-gray-800",

  // Cards
  card: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
  cardHover: "hover:shadow-lg dark:hover:shadow-gray-900/50",

  // Inputs
  input:
    "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100",
  inputFocus: "focus:ring-purple-500 dark:focus:ring-purple-400",

  // Buttons
  btnPrimary:
    "bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 text-white",
  btnSecondary:
    "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100",

  // Dividers
  divider: "border-gray-200 dark:border-gray-700",
};

// HOC to wrap components with dark mode classes
export const withDarkMode = (Component) => {
  return function DarkModeComponent(props) {
    const { darkMode } = useDarkMode();
    return <Component {...props} darkMode={darkMode} />;
  };
};

export default {
  DarkModeProvider,
  DarkModeToggle,
  DarkModeToggleSwitch,
  useDarkMode,
  withDarkMode,
  darkClasses,
};

import React, { useState, useEffect } from "react";

export default function ThemeToggler() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Fix: Define isDarkMode based on your actual state variable
  const isDarkMode = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      style={{
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        backgroundColor: 'transparent',
        transition: 'background-color 0.2s, transform 0.2s',
        outline: 'none',
      }}
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      onMouseEnter={(e) => {
        // Dynamic hover background depending on the theme
        e.currentTarget.style.backgroundColor = isDarkMode ? '#2d2d2d' : '#e2e8f0';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {isDarkMode ? (
        /* Minimalist Sun Icon for Dark Mode (to switch to Light) */
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        /* Minimalist Moon Icon for Light Mode (to switch to Dark) */
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4a5568"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
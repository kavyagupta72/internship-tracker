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

  return (
    <button onClick={toggleTheme} className="theme-toggle-btn">
      Switch to {theme === "light" ? "🌙 Dark" : "☀️ Light"} Mode
    </button>
  );
}
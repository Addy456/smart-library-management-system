import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

/**
 * ThemeProvider — toggles between light and dark using Tailwind's
 * `class` strategy. Persists to localStorage, respects the OS preference
 * on first visit.
 */
export const ThemeProvider = ({ children }) => {
  const getInitial = () => {
    if (typeof window === "undefined") return false;
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark") return true;
      if (stored === "light") return false;
      return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    } catch {
      return false;
    }
  };

  const [darkMode, setDarkMode] = useState(getInitial);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
    try { localStorage.setItem("theme", darkMode ? "dark" : "light"); } catch { /* ignore */ }
  }, [darkMode]);

  const toggleTheme = useCallback(() => setDarkMode((d) => !d), []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

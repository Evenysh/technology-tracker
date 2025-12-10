// src/contexts/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Загружаем тему из localStorage или ставим светлую по умолчанию
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("appTheme");
    return saved || "light";
  });

  // Применяем CSS-класс и сохраняем в localStorage
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark-theme");
    }

    localStorage.setItem("appTheme", theme);
  }, [theme]);

  // Переключатель темы
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value = { theme, setTheme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Основной hook
export function useTheme() {
  return useContext(ThemeContext);
}

// 🔥 ДОБАВЛЯЮ — чтобы App.jsx не ломался
export function useThemeMode() {
  return useTheme();
}

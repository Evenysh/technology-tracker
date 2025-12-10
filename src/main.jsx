// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Theme
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./theme/muiTheme.js";

// Контекст темы
import { ThemeProvider as ThemeModeProvider, useThemeMode } from "./contexts/ThemeContext.jsx";

function AppWithTheme() {
  // получаем текущий режим темы из твоего ThemeContext
  const { theme } = useThemeMode();

  // выбираем MUI-тему
  const muiTheme = theme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={muiTheme}>
      <App />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* глобальный провайдер темы */}
    <ThemeModeProvider>
      <AppWithTheme />
    </ThemeModeProvider>
  </React.StrictMode>
);

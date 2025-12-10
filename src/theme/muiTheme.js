// src/theme/muiTheme.js
import { createTheme } from "@mui/material/styles";

export const getMuiTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            background: {
              default: "#fdfcff",
              paper: "#ffffff",
            },
            primary: {
              main: "#7d3cff",
            },
            secondary: {
              main: "#9b5bff",
            },
            text: {
              primary: "#2c2b3c",
              secondary: "#4a4959",
            },
          }
        : {
            background: {
              default: "#1d1b26",
              paper: "#2a2735",
            },
            primary: {
              main: "#b388ff",
            },
            secondary: {
              main: "#d1b7ff",
            },
            text: {
              primary: "#ffffff",
              secondary: "#dcd4ff",
            },
          }),
    },

    typography: {
      fontFamily: "'Inter', sans-serif",
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 500 },
      h6: { fontWeight: 500 },
      button: { textTransform: "none", fontWeight: 600 },
    },

    shape: {
      borderRadius: 10,
    },

    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 14,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: "10px 20px",
          },
        },
      },
    },
  });


// 🔥 Добавляем отдельные экспорты, чтобы исправить ошибку
export const lightTheme = getMuiTheme("light");
export const darkTheme = getMuiTheme("dark");

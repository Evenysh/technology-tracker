// src/components/Navigation.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../i18n/translations";
import { useAuth } from "../contexts/AuthContext";

// === MUI Импорт ===
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import "./Navigation.css";

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const t = translations[language];

  // 🔐 Порядок: Home → Stats(если есть) → API Search → Settings(если есть)
  const navItems = [
    { path: "/", label: t.navigation.home, exact: true, icon: "🏠" },

    // 🔐 Stats показываем только авторизованным
    ...(isAuthenticated
      ? [{ path: "/stats", label: t.navigation.stats, icon: "📊" }]
      : []),

    // API Search всегда доступен
    { path: "/api-search", label: t.navigation.apiSearch || "API Поиск", icon: "🔍" },

    // 🔐 Settings показываем только авторизованным
    ...(isAuthenticated
      ? [{ path: "/settings", label: t.navigation.settings, icon: "⚙️" }]
      : []),
  ];

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  return (
    <AppBar position="sticky" color="default" sx={{ boxShadow: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* LOGO */}
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {t.navigation.appName || "Трекер технологий"}
        </Typography>

        {/* NAVIGATION BUTTONS */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                variant={isActive ? "contained" : "text"}
                color={isActive ? "primary" : "inherit"}
                sx={{
                  textTransform: "none",
                  fontWeight: isActive ? 700 : 500,
                  borderRadius: 2,
                }}
              >
                <span style={{ marginRight: 6 }}>{item.icon}</span>
                {item.label}
              </Button>
            );
          })}

          {/* 🔐 Кнопка ВОЙТИ / ВЫЙТИ */}
          {!isAuthenticated ? (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/login")}
              sx={{ ml: 1, borderRadius: 2 }}
            >
              {language === "ru" ? "Войти" : "Login"}
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              sx={{ ml: 1, borderRadius: 2 }}
            >
              {language === "ru" ? "Выйти" : "Logout"}
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;

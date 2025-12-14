// src/components/Navigation.jsx
import { useState } from "react";
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
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";

import "./Navigation.css";

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const t = translations[language];

  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

  // 🔐 Порядок: Home → Stats → API Search → Settings
  const navItems = [
    { path: "/", label: t.navigation.home, exact: true, icon: "🏠" },

    ...(isAuthenticated
      ? [{ path: "/stats", label: t.navigation.stats, icon: "📊" }]
      : []),

    { path: "/api-search", label: t.navigation.apiSearch || "API Поиск", icon: "🔍" },

    ...(isAuthenticated
      ? [{ path: "/settings", label: t.navigation.settings, icon: "⚙️" }]
      : []),
  ];

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  const drawerContent = (
    <Box sx={{ width: 260 }} onClick={toggleDrawer}>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {t.navigation.appName || "Трекер технологий"}
        </Typography>
      </Box>

      <List>
        {navItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          return (
            <ListItem
              key={item.path}
              button
              component={Link}
              to={item.path}
              selected={isActive}
            >
              <ListItemText
                primary={
                  <>
                    <span style={{ marginRight: 8 }}>{item.icon}</span>
                    {item.label}
                  </>
                }
              />
            </ListItem>
          );
        })}

        <Box sx={{ padding: 2 }}>
          {!isAuthenticated ? (
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={() => navigate("/login")}
            >
              {language === "ru" ? "Войти" : "Login"}
            </Button>
          ) : (
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={handleLogout}
            >
              {language === "ru" ? "Выйти" : "Logout"}
            </Button>
          )}
        </Box>
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="default" sx={{ boxShadow: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* ☰ BURGER — только на мобильных */}
        <IconButton
          edge="start"
          color="inherit"
          onClick={toggleDrawer}
          sx={{ display: { xs: "flex", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        {/* LOGO */}
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {t.navigation.appName || "Трекер технологий"}
        </Typography>

        {/* DESKTOP NAVIGATION */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
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

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
}

export default Navigation;

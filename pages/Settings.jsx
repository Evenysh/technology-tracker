// pages/Settings.jsx

import { useState, useEffect } from "react";
import { useLanguage } from "../src/contexts/LanguageContext";
import { useTechnologies } from "../src/contexts/TechnologiesContext";
import { translations } from "../src/i18n/translations";
import { useNotification } from "../src/contexts/NotificationContext";
import { useThemeMode } from "../src/contexts/ThemeContext";
import "./Settings.css";

// ⭐ MUI
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function Settings() {
  const { technologies, resetAllStatuses, resetAllData } = useTechnologies();
  const { language, changeLanguage } = useLanguage();
  const { theme, setTheme } = useThemeMode();
  const { showNotification } = useNotification();

  const t = translations[language];

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("appSettings");
    return saved ? JSON.parse(saved) : { theme: "light", language: "ru" };
  });

  /* =========================
     EFFECTS
     ========================= */

  useEffect(() => {
    if (settings.theme !== theme) {
      setTheme(settings.theme);
    }
  }, [settings.theme, theme, setTheme]);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark-theme",
      settings.theme === "dark"
    );
  }, [settings.theme]);

  /* =========================
     HANDLERS
     ========================= */

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));

    if (key === "language") changeLanguage(value);
    if (key === "theme") setTheme(value);
  };

  const handleLanguageChange = (value) => {
    if (value === language) return;

    const confirmMsg =
      value === "ru"
        ? "Переключить язык на русский?"
        : "Switch to English?";

    if (!window.confirm(confirmMsg)) return;

    handleSettingChange("language", value);

    showNotification(
      value === "ru" ? "Язык изменён" : "Language changed",
      "success"
    );
  };

  const handleResetSettings = () => {
    setSettings({ theme: "light", language: "ru" });
    changeLanguage("ru");
    setTheme("light");

    showNotification(
      language === "ru"
        ? "Настройки восстановлены по умолчанию"
        : "Settings restored",
      "info"
    );
  };

  const handleSaveSettings = () => {
    localStorage.setItem("appSettings", JSON.stringify(settings));

    showNotification(
      language === "ru" ? "Настройки сохранены" : "Settings saved",
      "success"
    );
  };

  const handleCancel = () => {
    const saved = localStorage.getItem("appSettings");
    if (!saved) return;

    const parsed = JSON.parse(saved);
    setSettings(parsed);
    changeLanguage(parsed.language);
    setTheme(parsed.theme);

    showNotification(
      language === "ru" ? "Изменения отменены" : "Changes canceled",
      "info"
    );
  };

  const handleClearData = () => {
    const confirmMsg =
      language === "ru"
        ? "Удалить ВСЕ данные приложения?"
        : "Delete ALL app data?";

    if (!window.confirm(confirmMsg)) return;

    resetAllData();
    localStorage.removeItem("appSettings");

    document.documentElement.classList.remove("dark-theme");
    changeLanguage("ru");
    setTheme("light");
    setSettings({ theme: "light", language: "ru" });

    showNotification(
      language === "ru" ? "Все данные удалены" : "All data deleted",
      "error"
    );
  };

  const handleResetProgress = () => {
    resetAllStatuses();

    showNotification(
      language === "ru" ? "Прогресс сброшен" : "Progress reset",
      "info"
    );
  };

  const handleExportData = () => {
    const data = {
      technologies,
      settings,
      exportedAt: new Date().toISOString(),
      version: "1.0.0",
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `technology-tracker-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();

    URL.revokeObjectURL(url);

    showNotification(
      language === "ru" ? "Файл экспортирован" : "Export complete",
      "success"
    );
  };

  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (!data.technologies) throw new Error();

          localStorage.setItem(
            "technologies",
            JSON.stringify(data.technologies)
          );

          showNotification(
            language === "ru"
              ? "Данные импортированы (перезагрузите страницу)"
              : "Data imported (refresh required)",
            "success"
          );

          setTimeout(() => window.location.reload(), 700);
        } catch {
          showNotification(
            language === "ru" ? "Ошибка чтения файла" : "File read error",
            "error"
          );
        }
      };

      reader.readAsText(file);
    };

    input.click();
  };

  /* =========================
     RENDER
     ========================= */

  return (
    <Container maxWidth={false}>
      <div className="settings-container">
        <div className="settings-header">
          <h1>{t.settings.title}</h1>
          <p>{t.settings.subtitle}</p>
        </div>

        <Grid container spacing={4}>
          {/* ===== ЛЕВАЯ КОЛОНКА ===== */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {/* Основные настройки */}
              <Grid item xs={12} md={6}>
                <div className="settings-section">
                  <div className="section-title">
                    <h2>{t.settings.basicSettings}</h2>
                  </div>

                  {/* ТЕМА */}
                  <div className="setting-item">
                    <div className="setting-label">
                      <h3>{t.settings.theme}</h3>
                      <p>{t.settings.themeDesc}</p>
                    </div>

                    <FormControl fullWidth>
                      <Select
                        value={settings.theme}
                        onChange={(e) =>
                          handleSettingChange("theme", e.target.value)
                        }
                        fullWidth
                        sx={{
                          height: 48,
                          borderRadius: "10px",
                          backgroundColor: "#f3ecff",
                          color: "#5a3cc8",
                          fontWeight: 600,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#d8cfff",
                          },
                        }}
                      >
                        <MenuItem value="light">
                          {t.settings.light}
                        </MenuItem>
                        <MenuItem value="dark">
                          {t.settings.dark}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  {/* ЯЗЫК */}
                  <div className="setting-item">
                    <div className="setting-label">
                      <h3>{t.settings.language}</h3>
                      <p>{t.settings.languageDesc}</p>
                    </div>

                    <FormControl fullWidth>
                      <Select
                        value={settings.language}
                        onChange={(e) =>
                          handleLanguageChange(e.target.value)
                        }
                        fullWidth
                        sx={{
                          height: 48,
                          borderRadius: "10px",
                          backgroundColor: "#f3ecff",
                          color: "#5a3cc8",
                          fontWeight: 600,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#d8cfff",
                          },
                        }}
                      >
                        <MenuItem value="ru">
                          {t.settings.russian}
                        </MenuItem>
                        <MenuItem value="en">
                          {t.settings.english}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </Grid>

              {/* Управление данными */}
              <Grid item xs={12} md={6}>
                <div className="settings-section">
                  <div className="section-title">
                    <h2>{t.settings.dataManagement}</h2>
                  </div>

                  <div className="actions-group">
                    <button className="action-btn" onClick={handleExportData}>
                      {t.settings.exportData} ({technologies.length})
                    </button>

                    <button className="action-btn" onClick={handleImportData}>
                      {t.settings.importData}
                    </button>

                    <button className="action-btn" onClick={handleResetProgress}>
                      {t.settings.resetProgress}
                    </button>

                    <button className="action-btn" onClick={handleClearData}>
                      {t.settings.clearData}
                    </button>
                  </div>
                </div>
              </Grid>

              {/* О приложении */}
              <Grid item xs={12}>
                <div className="settings-section">
                  <div className="section-title">
                    <h2>{t.settings.aboutApp}</h2>
                  </div>

                  <div className="app-info">
                    <div className="info-item">
                      <span>{t.settings.version}:</span>
                      <strong>1.0.0</strong>
                    </div>
                    <div className="info-item">
                      <span>{t.settings.technologiesCount}:</span>
                      <strong>{technologies.length}</strong>
                    </div>
                    <div className="info-item">
                      <span>{t.settings.studied}:</span>
                      <strong>
                        {
                          technologies.filter(
                            (t) => t.status === "completed"
                          ).length
                        }
                      </strong>
                    </div>
                    <div className="info-item">
                      <span>{t.settings.creationDate}:</span>
                      <strong>2025</strong>
                    </div>
                    <div className="info-item">
                      <span>{t.settings.author}:</span>
                      <strong>Evenysh</strong>
                    </div>
                  </div>

                  <div className="app-links">
                    <a
                      href="https://github.com/Evenysh/technology-tracker"
                      className="github-link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t.settings.myGitHub}
                    </a>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>

          {/* ===== ПРАВАЯ КОЛОНКА ===== */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <div className="settings-section">
                  <div className="section-title">
                    <h2>Тест компонентов MUI</h2>
                  </div>

                  <Box sx={{ padding: "10px 0" }}>
                    <Button
                      variant="contained"
                      onClick={() =>
                        showNotification("MUI кнопка работает!", "success")
                      }
                    >
                      MUI кнопка
                    </Button>
                  </Box>
                </div>
              </Grid>

              <Grid item xs={12}>
                <div className="settings-section">
                  <div className="section-title">
                    <h2>{t.settings.resetSettingsTitle}</h2>
                  </div>

                  <div className="reset-section">
                    <p className="reset-description">
                      {t.settings.resetSettingsDesc}
                    </p>

                    <button
                      className="reset-btn"
                      onClick={handleResetSettings}
                    >
                      {t.settings.resetSettings}
                    </button>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <div className="action-buttons">
          <button className="cancel-btn" onClick={handleCancel}>
            {t.settings.cancel}
          </button>

          <button className="save-btn" onClick={handleSaveSettings}>
            {t.settings.save}
          </button>
        </div>
      </div>
    </Container>
  );
}

export default Settings;

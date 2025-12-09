// pages/Settings.jsx
import { useState, useEffect } from "react";
import { useLanguage } from "../src/contexts/LanguageContext";
import { useTechnologies } from "../src/contexts/TechnologiesContext";
import { translations } from "../src/i18n/translations";
import { useNotification } from "../src/contexts/NotificationContext";
import "./Settings.css";

function Settings() {
  const { technologies, resetAllStatuses, resetAllData } = useTechnologies();
  const { language, changeLanguage } = useLanguage();
  const t = translations[language];

  const { showNotification } = useNotification(); // ⭐ Notification hook

  // Загружаем настройки
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("appSettings");
    return saved ? JSON.parse(saved) : { theme: "light", language: "ru" };
  });

  // Применяем тему
  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark-theme",
      settings.theme === "dark"
    );
  }, [settings.theme]);

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    if (key === "language") changeLanguage(value);
  };

  const handleResetSettings = () => {
    setSettings({ theme: "light", language: "ru" });
    changeLanguage("ru");

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

    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings(parsed);
      changeLanguage(parsed.language);
    }

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

          if (!data.technologies) {
            showNotification(
              language === "ru"
                ? "Некорректный файл импорта"
                : "Invalid import file",
              "error"
            );
            return;
          }

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

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    if (newLanguage === language) return;

    const confirmMsg =
      newLanguage === "ru"
        ? "Переключить язык на русский?"
        : "Switch to English?";

    if (!window.confirm(confirmMsg)) return;

    handleSettingChange("language", newLanguage);

    showNotification(
      newLanguage === "ru" ? "Язык изменён" : "Language changed",
      "success"
    );
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>{t.settings.title}</h1>
        <p>{t.settings.subtitle}</p>
      </div>

      <div className="settings-grid">
        {/* Базовые настройки */}
        <div className="settings-section">
          <div className="section-title">
            <h2>{t.settings.basicSettings}</h2>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <h3>{t.settings.theme}</h3>
              <p>{t.settings.themeDesc}</p>
            </div>

            <select
              className="select-dropdown"
              value={settings.theme}
              onChange={(e) => handleSettingChange("theme", e.target.value)}
            >
              <option value="light">{t.settings.light}</option>
              <option value="dark">{t.settings.dark}</option>
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <h3>{t.settings.language}</h3>
              <p>{t.settings.languageDesc}</p>
            </div>

            <select
              className="select-dropdown"
              value={settings.language}
              onChange={handleLanguageChange}
            >
              <option value="ru">{t.settings.russian}</option>
              <option value="en">{t.settings.english}</option>
            </select>
          </div>
        </div>

        {/* Управление данными */}
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

          <p className="data-info">{t.settings.dataStorage}</p>
        </div>

        {/* О приложении */}
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
                {technologies.filter((t) => t.status === "completed").length}
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
            >
              {t.settings.myGitHub}
            </a>
          </div>
        </div>

        {/* Сброс настроек */}
        <div className="settings-section">
          <div className="section-title">
            <h2>{t.settings.resetSettingsTitle}</h2>
          </div>

          <div className="reset-section">
            <p className="reset-description">{t.settings.resetSettingsDesc}</p>

            <button className="reset-btn" onClick={handleResetSettings}>
              {t.settings.resetSettings}
            </button>
          </div>
        </div>
      </div>

      {/* Нижние кнопки */}
      <div className="action-buttons">
        <button className="cancel-btn" onClick={handleCancel}>
          {t.settings.cancel}
        </button>

        <button className="save-btn" onClick={handleSaveSettings}>
          {t.settings.save}
        </button>
      </div>
    </div>
  );
}

export default Settings;

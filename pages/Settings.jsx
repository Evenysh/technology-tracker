// pages/Settings.jsx
import { useState, useEffect } from 'react';
import { useLanguage } from '../src/contexts/LanguageContext';
import { useTechnologies } from '../src/contexts/TechnologiesContext';
import { translations } from '../src/i18n/translations';
import './Settings.css';

function Settings() {
  const { technologies, resetAllStatuses, resetAllData } = useTechnologies(); // Добавили resetAllData
  const { language, changeLanguage } = useLanguage();
  const t = translations[language];
  
  // Загружаем настройки только один раз при монтировании
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      language: 'ru'
    };
  });

  // ПРИМЕНЯЕМ ТЕМУ ПРИ ИЗМЕНЕНИИ settings.theme
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [settings.theme]);

  const handleSettingChange = (key, value) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    setSettings(newSettings);
    
    // Меняем язык в контексте при изменении
    if (key === 'language') {
      changeLanguage(value);
    }
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      theme: 'light',
      language: 'ru'
    };
    setSettings(defaultSettings);
    changeLanguage('ru');
  };

  const handleSaveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    alert(language === 'ru' ? 'Настройки сохранены!' : 'Settings saved!');
  };

  const handleCancel = () => {
    // Восстанавливаем сохранённые настройки из localStorage
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      const savedSettings = JSON.parse(saved);
      setSettings(savedSettings);
      if (savedSettings.language !== language) {
        changeLanguage(savedSettings.language);
      }
    } else {
      handleResetSettings();
    }
  };

  // Управление данными - ИСПРАВЛЕННАЯ ВЕРСИЯ
  const handleClearData = () => {
    if (window.confirm(
      language === 'ru' 
        ? 'Вы уверены? Это удалит ВСЕ технологии, заметки и сбросит настройки.' 
        : 'Are you sure? This will delete ALL technologies, notes and reset settings.'
    )) {
      // 1. Сбрасываем все данные в контексте
      resetAllData();
      
      // 2. Удаляем из localStorage
      localStorage.removeItem('appSettings');
      
      // 3. Устанавливаем светлую тему
      document.documentElement.classList.remove('dark-theme');
      
      // 4. Сбрасываем язык
      changeLanguage('ru');
      
      // 5. Сбрасываем локальное состояние настроек
      setSettings({
        theme: 'light',
        language: 'ru'
      });
      
      alert(language === 'ru' 
        ? 'Все данные очищены! Приложение сброшено к начальному состоянию.' 
        : 'All data cleared! App reset to initial state.'
      );
    }
  };

  const handleResetProgress = () => {
    if (window.confirm(
      language === 'ru' 
        ? 'Сбросить прогресс всех технологий?' 
        : 'Reset progress of all technologies?'
    )) {
      resetAllStatuses();
      alert(language === 'ru' ? 'Прогресс сброшен!' : 'Progress reset!');
    }
  };

  const handleExportData = () => {
    const data = {
      technologies: technologies,
      settings: settings,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `technology-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert(language === 'ru' ? 'Данные экспортированы!' : 'Data exported!');
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          
          if (data.technologies) {
            localStorage.setItem('technologies', JSON.stringify(data.technologies));
            alert(
              language === 'ru' 
                ? 'Данные импортированы! Перезагрузите страницу.' 
                : 'Data imported! Please refresh the page.'
            );
            window.location.reload();
          } else {
            alert(
              language === 'ru' 
                ? 'Неверный формат файла' 
                : 'Invalid file format'
            );
          }
        } catch (error) {
          alert(
            language === 'ru' 
              ? 'Ошибка чтения файла' 
              : 'Error reading file'
          );
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
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
            <div className="setting-control">
              <select
                className="select-dropdown"
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
              >
                <option value="light">{t.settings.light}</option>
                <option value="dark">{t.settings.dark}</option>
              </select>
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-label">
              <h3>{t.settings.language}</h3>
              <p>{t.settings.languageDesc}</p>
            </div>
            <div className="setting-control">
              <select
                className="select-dropdown"
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
              >
                <option value="ru">{t.settings.russian}</option>
                <option value="en">{t.settings.english}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Управление данными */}
        <div className="settings-section">
          <div className="section-title">
            <h2>{t.settings.dataManagement}</h2>
          </div>
          
          <div className="actions-group">
            <button className="action-btn export-btn" onClick={handleExportData}>
              {t.settings.exportData} ({technologies.length})
            </button>
            
            <button className="action-btn import-btn" onClick={handleImportData}>
              {t.settings.importData}
            </button>
            
            <button className="action-btn reset-btn" onClick={handleResetProgress}>
              {t.settings.resetProgress}
            </button>
            
            <button className="action-btn clear-btn" onClick={handleClearData}>
              {t.settings.clearData}
            </button>
          </div>
          
          <div className="data-info">
            <p>{t.settings.dataStorage}</p>
          </div>
        </div>

        {/* О приложении */}
        <div className="settings-section">
          <div className="section-title">
            <h2>{t.settings.aboutApp}</h2>
          </div>
          
          <div className="app-info">
            <div className="info-item">
              <span className="info-label">{t.settings.version}:</span>
              <span className="info-value">1.0.0</span>
            </div>
            <div className="info-item">
              <span className="info-label">{t.settings.technologiesCount}:</span>
              <span className="info-value">{technologies.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">{t.settings.studied}:</span>
              <span className="info-value">
                {technologies.filter(t => t.status === 'completed').length}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">{t.settings.creationDate}:</span>
              <span className="info-value">2025</span>
            </div>
            <div className="info-item">
              <span className="info-label">{t.settings.author}:</span>
              <span className="info-value">Evenysh</span>
            </div>
          </div>
          
          <div className="app-links">
            <a 
              href="https://github.com/Evenysh/technology-tracker" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-link"
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
      </div>

      {/* Кнопки действий */}
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
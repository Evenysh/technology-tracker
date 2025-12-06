// src/contexts/LanguageContext.jsx
import { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      return settings.language || 'ru';
    }
    return 'ru';
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    // Обновляем настройки в localStorage
    const saved = localStorage.getItem('appSettings');
    const settings = saved ? JSON.parse(saved) : {};
    settings.language = lang;
    localStorage.setItem('appSettings', JSON.stringify(settings));
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
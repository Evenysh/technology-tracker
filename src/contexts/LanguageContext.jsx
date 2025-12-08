// src/contexts/LanguageContext.jsx
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useTechnologies } from './TechnologiesContext';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const { updateDescriptionsForLanguage } = useTechnologies();
  const [language, setLanguage] = useState(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        return settings.language || 'ru';
      } catch (e) {
        return 'ru';
      }
    }
    return 'ru';
  });

  // Функция смены языка с обновлением описаний
  const changeLanguage = useCallback((newLanguage) => {
    if (newLanguage === language) return; // Если язык не изменился, ничего не делаем
    
    setLanguage(newLanguage);
    
    // Обновляем язык в localStorage
    const savedSettings = localStorage.getItem('appSettings');
    let settings = {};
    if (savedSettings) {
      try {
        settings = JSON.parse(savedSettings);
      } catch (e) {
        settings = {};
      }
    }
    
    settings.language = newLanguage;
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    // Обновляем описания технологий на новом языке
    if (updateDescriptionsForLanguage) {
      updateDescriptionsForLanguage(newLanguage);
    }
  }, [language, updateDescriptionsForLanguage]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
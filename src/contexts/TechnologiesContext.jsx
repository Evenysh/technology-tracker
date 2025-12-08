// src/contexts/TechnologiesContext.jsx
import { createContext, useState, useContext, useEffect, useCallback } from 'react';

const TechnologiesContext = createContext();

// СЛОВАРЬ переводов для всех технологий
const TECHNOLOGY_TRANSLATIONS = {
  react: {
    ru: 'Библиотека для создания пользовательских интерфейсов',
    en: 'A library for building user interfaces'
  },
  typescript: {
    ru: 'Статическая типизация для JavaScript',
    en: 'Static typing for JavaScript'
  },
  vite: {
    ru: 'Современный инструмент сборки',
    en: 'Modern build tool'
  },
  'react-router': {
    ru: 'Маршрутизация для React приложений',
    en: 'Routing for React applications'
  },
  'css-in-js': {
    ru: 'Стилизация компонентов в JavaScript',
    en: 'Styling components in JavaScript'
  },
  'node-js': {
    ru: 'Среда выполнения JavaScript на сервере',
    en: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine'
  },
  mongodb: {
    ru: 'Документо-ориентированная NoSQL база данных',
    en: 'Document-oriented NoSQL database'
  },
  docker: {
    ru: 'Платформа для контейнеризации приложений',
    en: 'Platform for developing, shipping, and running applications in containers'
  },
  graphql: {
    ru: 'Язык запросов для API',
    en: 'Query language for APIs'
  },
  'vue-js': {
    ru: 'Прогрессивный JavaScript-фреймворк',
    en: 'Progressive JavaScript framework'
  },
  postgresql: {
    ru: 'Реляционная база данных с открытым исходным кодом',
    en: 'Open source relational database'
  },
  'next-js': {
    ru: 'React-фреймворк для продакшена',
    en: 'The React Framework for Production'
  },
  'express-js': {
    ru: 'Минималистичный веб-фреймворк для Node.js',
    en: 'Minimalist web framework for Node.js'
  },
  python: {
    ru: 'Высокоуровневый язык программирования общего назначения',
    en: 'High-level general-purpose programming language'
  },
  git: {
    ru: 'Распределённая система контроля версий',
    en: 'Distributed version control system'
  }
};

// Функция для получения перевода по названию технологии
const getTechnologyTranslation = (title, language) => {
  const key = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/\s+/g, '-');
  if (TECHNOLOGY_TRANSLATIONS[key] && TECHNOLOGY_TRANSLATIONS[key][language]) {
    return TECHNOLOGY_TRANSLATIONS[key][language];
  }
  return null;
};

// Начальные технологии с использованием переводов
const getInitialTechnologies = (language = 'ru') => {
  return [
    {
      id: 1,
      title: 'React',
      description: getTechnologyTranslation('React', language) || 'Библиотека для создания пользовательских интерфейсов',
      status: 'in-progress',
      notes: ''
    },
    {
      id: 2,
      title: 'TypeScript',
      description: getTechnologyTranslation('TypeScript', language) || 'Статическая типизация для JavaScript',
      status: 'not-started',
      notes: ''
    },
    {
      id: 3,
      title: 'Vite',
      description: getTechnologyTranslation('Vite', language) || 'Современный инструмент сборки',
      status: 'completed',
      notes: ''
    },
    {
      id: 4,
      title: 'React Router',
      description: getTechnologyTranslation('React Router', language) || 'Маршрутизация для React приложений',
      status: 'in-progress',
      notes: ''
    },
    {
      id: 5,
      title: 'CSS-in-JS',
      description: getTechnologyTranslation('CSS-in-JS', language) || 'Стилизация компонентов в JavaScript',
      status: 'not-started',
      notes: ''
    }
  ];
};

export function TechnologiesProvider({ children }) {
  const [technologies, setTechnologies] = useState(() => {
    const saved = localStorage.getItem('technologies');
    return saved ? JSON.parse(saved) : getInitialTechnologies();
  });

  const [currentLanguage, setCurrentLanguage] = useState(() => {
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

  useEffect(() => {
    localStorage.setItem('technologies', JSON.stringify(technologies));
  }, [technologies]);

  // Функция для обновления описаний при смене языка
  const updateDescriptionsForLanguage = useCallback((language) => {
    setTechnologies(prev => prev.map(tech => {
      // Пытаемся найти перевод для этой технологии
      const translation = getTechnologyTranslation(tech.title, language);
      
      // Если перевод найден, обновляем описание
      if (translation) {
        return {
          ...tech,
          description: translation
        };
      }
      
      // Если перевода нет, оставляем текущее описание
      return tech;
    }));
    
    // Сохраняем текущий язык в контексте
    setCurrentLanguage(language);
  }, []);

  // Функция удаления технологии
  const removeTechnology = useCallback((id) => {
    setTechnologies(prev => prev.filter(tech => tech.id !== id));
  }, []);

  // Функция добавления технологии
  const addTechnology = useCallback((techData) => {
    const newTech = {
      id: Date.now(),
      title: techData.title || techData.name || 'Новая технология',
      description: techData.description || 'Описание отсутствует',
      status: techData.status || 'not-started',
      notes: techData.notes || '',
      category: techData.category || 'other'
    };
    
    setTechnologies(prev => [...prev, newTech]);
    return newTech;
  }, []);

  const updateNotes = useCallback((id, notes) => {
    setTechnologies(prev => prev.map(tech => 
      tech.id === id ? { ...tech, notes } : tech
    ));
  }, []);

  const toggleStatus = useCallback((id) => {
    setTechnologies(prev => prev.map(tech => {
      if (tech.id === id) {
        const statusOrder = ['not-started', 'in-progress', 'completed'];
        const currentIndex = statusOrder.indexOf(tech.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        return { ...tech, status: statusOrder[nextIndex] };
      }
      return tech;
    }));
  }, []);

  const markAllCompleted = useCallback(() => {
    setTechnologies(prev => prev.map(tech => ({ ...tech, status: 'completed' })));
  }, []);

  const resetAllStatuses = useCallback(() => {
    setTechnologies(prev => prev.map(tech => ({ ...tech, status: 'not-started' })));
  }, []);

  // Функция: Полный сброс ВСЕХ данных
  const resetAllData = useCallback((language = 'ru') => {
    const resetTechnologies = getInitialTechnologies().map(tech => {
      const translation = getTechnologyTranslation(tech.title, language) || tech.description;
      return {
        ...tech,
        description: translation,
        status: 'not-started',
        notes: ''
      };
    });
    setTechnologies(resetTechnologies);
    setCurrentLanguage(language);
  }, []);

  // Функция: Проверка, существует ли уже технология с таким названием
  const technologyExists = useCallback((title) => {
    return technologies.some(tech => 
      tech.title.toLowerCase() === title.toLowerCase()
    );
  }, [technologies]);

  // Функция: Удаление всех технологий
  const clearAllTechnologies = useCallback(() => {
    setTechnologies([]);
  }, []);

  const progress = technologies.length > 0 
    ? Math.round((technologies.filter(t => t.status === 'completed').length / technologies.length) * 100)
    : 0;

  const value = {
    technologies,
    currentLanguage,
    addTechnology,
    removeTechnology,
    updateDescriptionsForLanguage,
    updateNotes,
    toggleStatus,
    markAllCompleted,
    resetAllStatuses,
    resetAllData,
    clearAllTechnologies,
    technologyExists,
    progress
  };

  return (
    <TechnologiesContext.Provider value={value}>
      {children}
    </TechnologiesContext.Provider>
  );
}

export const useTechnologies = () => useContext(TechnologiesContext);
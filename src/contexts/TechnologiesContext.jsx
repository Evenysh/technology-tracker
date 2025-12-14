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
    en: "JavaScript runtime built on Chrome's V8 JavaScript engine"
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
      description:
        getTechnologyTranslation('React', language) ||
        (language === 'ru'
          ? 'Библиотека для создания пользовательских интерфейсов'
          : 'A library for building user interfaces'),
      status: 'in-progress',
      notes: '',
      // Новые поля для сроков
      startDate: '',
      deadline: '',
      estimatedHours: 0,
      priority: 'high',
      deadlineNotes: '',
      category: 'frontend',

      // ✅ НОВОЕ (для 24 практики): ресурсы по технологии
      resources: []
    },
    {
      id: 2,
      title: 'TypeScript',
      description:
        getTechnologyTranslation('TypeScript', language) ||
        (language === 'ru'
          ? 'Статическая типизация для JavaScript'
          : 'Static typing for JavaScript'),
      status: 'not-started',
      notes: '',
      // Новые поля для сроков
      startDate: '',
      deadline: '',
      estimatedHours: 0,
      priority: 'medium',
      deadlineNotes: '',
      category: 'frontend',

      // ✅ НОВОЕ
      resources: []
    },
    {
      id: 3,
      title: 'Vite',
      description:
        getTechnologyTranslation('Vite', language) ||
        (language === 'ru'
          ? 'Современный инструмент сборки'
          : 'Modern build tool'),
      status: 'completed',
      notes: '',
      startDate: '',
      deadline: '',
      estimatedHours: 20,
      priority: 'low',
      deadlineNotes: '',
      category: 'tool',

      // ✅ НОВОЕ
      resources: []
    },
    {
      id: 4,
      title: 'React Router',
      description:
        getTechnologyTranslation('React Router', language) ||
        (language === 'ru'
          ? 'Маршрутизация для React приложений'
          : 'Routing for React applications'),
      status: 'in-progress',
      notes: '',
      startDate: '',
      deadline: '',
      estimatedHours: 15,
      priority: 'medium',
      deadlineNotes: '',
      category: 'frontend',

      // ✅ НОВОЕ
      resources: []
    },
    {
      id: 5,
      title: 'CSS-in-JS',
      description:
        getTechnologyTranslation('CSS-in-JS', language) ||
        (language === 'ru'
          ? 'Стилизация компонентов в JavaScript'
          : 'Styling components in JavaScript'),
      status: 'not-started',
      notes: '',
      startDate: '',
      deadline: '',
      estimatedHours: 25,
      priority: 'low',
      deadlineNotes: '',
      category: 'frontend',

      // ✅ НОВОЕ
      resources: []
    }
  ];
};

export function TechnologiesProvider({ children }) {
  // ИСПРАВЛЕНО: правильная загрузка данных
  const [technologies, setTechnologies] = useState(() => {
    try {
      const saved = localStorage.getItem('technologies');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Преобразуем все estimatedHours в числа при загрузке
        // ✅ НОВОЕ: добавляем страховку resources, если раньше их не было
        return parsed.map(tech => ({
          ...tech,
          estimatedHours: tech.estimatedHours !== undefined ? Number(tech.estimatedHours) : 0,
          resources: Array.isArray(tech.resources) ? tech.resources : []
        }));
      }
      return getInitialTechnologies();
    } catch (error) {
      console.error('Ошибка загрузки технологий:', error);
      return getInitialTechnologies();
    }
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
    try {
      localStorage.setItem('technologies', JSON.stringify(technologies));
      console.log('💾 Технологии сохранены в localStorage:', technologies);
    } catch (error) {
      console.error('Ошибка сохранения технологий:', error);
    }
  }, [technologies]);

  // Функция для обновления описаний при смене языка
  const updateDescriptionsForLanguage = useCallback((language) => {
    setTechnologies(prev => prev.map(tech => {
      const translation = getTechnologyTranslation(tech.title, language);
      if (translation) {
        return {
          ...tech,
          description: translation
        };
      }
      return tech;
    }));
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
      category: techData.category || 'other',
      // Новые поля для сроков
      startDate: techData.startDate || '',
      deadline: techData.deadline || '',
      estimatedHours: techData.estimatedHours ? Number(techData.estimatedHours) : 0,
      priority: techData.priority || 'medium',
      deadlineNotes: techData.deadlineNotes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      // ✅ НОВОЕ (для 24 практики): ресурсы сохраняем в технологию
      resources: Array.isArray(techData.resources) ? techData.resources : []
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

  // ✅ Функция: Полный сброс ВСЕХ данных (ИСПРАВЛЕНА ПО ТВОЕМУ ТЗ)
  // Требование: priority остаётся как в базе, но сроки/часы/заметки по срокам должны очищаться у ВСЕХ технологий.
  const resetAllData = useCallback(() => {
    const resetTechnologies = getInitialTechnologies(currentLanguage).map(tech => {
      const translation = getTechnologyTranslation(tech.title, currentLanguage) || tech.description;

      return {
        ...tech,
        description: translation,

        // сбрасываем прогресс и заметки
        status: 'not-started',
        notes: '',

        // 🔥 КЛЮЧЕВОЕ: очищаем дедлайны/часы/заметки по срокам ДЛЯ ВСЕХ,
        // чтобы первая технология (React) не оставалась "особенной"
        startDate: '',
        deadline: '',
        estimatedHours: 0,
        deadlineNotes: '',

        // ✅ НОВОЕ: ресурсы тоже очищаем (после "Очистить все данные")
        resources: []

        // priority НЕ трогаем — остаётся как в базе (high/medium/low и т.д.)
      };
    });

    setTechnologies(resetTechnologies);
  }, [currentLanguage]);

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

  // ✅ НОВОЕ (для 24 практики): сохранить ресурсы в технологию по id
  // Это "использование данных из API внутри логики приложения", а не просто показ на экране.
  const addResourcesToTechnology = useCallback((id, resources) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === id
          ? {
              ...tech,
              resources: Array.isArray(resources) ? resources : [],
              updatedAt: new Date().toISOString()
            }
          : tech
      )
    );
  }, []);

  // ФУНКЦИЯ: Обновление сроков технологии (ИСПРАВЛЕНА!)
  const updateDeadline = useCallback((id, deadlineData) => {
    console.log('🔄 Контекст: обновление дедлайна для технологии', { id, deadlineData });

    setTechnologies(prev => {
      const updated = prev.map(tech => {
        if (tech.id === id) {
          console.log('📝 Найдена технология для обновления:', tech.title);

          // ИСПРАВЛЕНО: правильное преобразование часов
          let estimatedHours = 0;
          if (deadlineData.estimatedHours !== undefined && deadlineData.estimatedHours !== null) {
            estimatedHours = Number(deadlineData.estimatedHours);
            if (isNaN(estimatedHours)) estimatedHours = 0;
          }

          return {
            ...tech,
            startDate: deadlineData.startDate || tech.startDate || '',
            deadline: deadlineData.deadline || tech.deadline || '',
            estimatedHours: estimatedHours,
            priority: deadlineData.priority || tech.priority || 'medium',
            deadlineNotes: deadlineData.notes || deadlineData.deadlineNotes || tech.deadlineNotes || '',
            updatedAt: new Date().toISOString()
          };
        }
        return tech;
      });

      try {
        localStorage.setItem('technologies', JSON.stringify(updated));
        console.log('💾 Данные сохранены в localStorage');
      } catch (error) {
        console.error('Ошибка сохранения в localStorage:', error);
      }

      return updated;
    });
  }, []);

  // ФУНКЦИЯ: Массовое обновление сроков
  const bulkUpdateDeadlines = useCallback((ids, deadlineData) => {
    setTechnologies(prev => prev.map(tech => {
      if (ids.includes(tech.id)) {
        const estimatedHours = deadlineData.estimatedHours !== undefined
          ? Number(deadlineData.estimatedHours)
          : tech.estimatedHours;

        return {
          ...tech,
          ...deadlineData,
          estimatedHours: estimatedHours,
          updatedAt: new Date().toISOString()
        };
      }
      return tech;
    }));
  }, []);

  // ФУНКЦИЯ: Массовое обновление статусов (ДОБАВЛЕНО ДЛЯ ЗАДАНИЯ 2)
  const bulkUpdateStatuses = useCallback((changes) => {
    console.log('🔄 Контекст: массовое обновление статусов', changes);

    setTechnologies(prev => {
      const updated = prev.map(tech => {
        const change = changes.find(c => c.id === tech.id);
        if (change) {
          console.log(`📝 Обновление статуса для "${tech.title}": ${tech.status} -> ${change.status}`);
          return {
            ...tech,
            status: change.status,
            updatedAt: new Date().toISOString()
          };
        }
        return tech;
      });

      try {
        localStorage.setItem('technologies', JSON.stringify(updated));
        console.log('💾 Данные сохранены в localStorage после массового обновления');
      } catch (error) {
        console.error('Ошибка сохранения в localStorage:', error);
      }

      return updated;
    });
  }, []);

  // ФУНКЦИЯ: Расчет прогресса по времени для технологии
  const getDeadlineProgress = useCallback((tech) => {
    if (!tech.startDate || !tech.deadline) return null;

    const start = new Date(tech.startDate);
    const deadline = new Date(tech.deadline);
    const today = new Date();

    if (today < start) return 0;
    if (today > deadline) return 100;

    const totalDays = (deadline - start) / (1000 * 60 * 60 * 24);
    const passedDays = (today - start) / (1000 * 60 * 60 * 24);

    return Math.round((passedDays / totalDays) * 100);
  }, []);

  // ФУНКЦИЯ: Получение просроченных технологий
  const getOverdueTechnologies = useCallback(() => {
    const today = new Date();
    return technologies.filter(tech => {
      if (!tech.deadline || tech.status === 'completed') return false;
      return new Date(tech.deadline) < today;
    });
  }, [technologies]);

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

    // Новые функции для сроков
    updateDeadline,
    bulkUpdateDeadlines,
    bulkUpdateStatuses,
    getDeadlineProgress,
    getOverdueTechnologies,

    // ✅ НОВОЕ (для 24 практики)
    addResourcesToTechnology,

    progress
  };

  return (
    <TechnologiesContext.Provider value={value}>
      {children}
    </TechnologiesContext.Provider>
  );
}

export const useTechnologies = () => useContext(TechnologiesContext);

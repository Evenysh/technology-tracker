// src/contexts/TechnologiesContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';

const TechnologiesContext = createContext();

const initialTechnologies = [
  {
    id: 1,
    title: 'React',
    description: 'Библиотека для создания пользовательских интерфейсов',
    status: 'in-progress',
    notes: ''
  },
  {
    id: 2,
    title: 'TypeScript',
    description: 'Статическая типизация для JavaScript',
    status: 'not-started',
    notes: ''
  },
  {
    id: 3,
    title: 'Vite',
    description: 'Современный инструмент сборки',
    status: 'completed',
    notes: ''
  },
  {
    id: 4,
    title: 'React Router',
    description: 'Маршрутизация для React приложений',
    status: 'in-progress',
    notes: ''
  },
  {
    id: 5,
    title: 'CSS-in-JS',
    description: 'Стилизация компонентов в JavaScript',
    status: 'not-started',
    notes: ''
  }
];

export function TechnologiesProvider({ children }) {
  const [technologies, setTechnologies] = useState(() => {
    const saved = localStorage.getItem('technologies');
    return saved ? JSON.parse(saved) : initialTechnologies;
  });

  useEffect(() => {
    localStorage.setItem('technologies', JSON.stringify(technologies));
  }, [technologies]);

  const updateNotes = (id, notes) => {
    setTechnologies(prev => prev.map(tech => 
      tech.id === id ? { ...tech, notes } : tech
    ));
  };

  const toggleStatus = (id) => {
    setTechnologies(prev => prev.map(tech => {
      if (tech.id === id) {
        const statusOrder = ['not-started', 'in-progress', 'completed'];
        const currentIndex = statusOrder.indexOf(tech.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        return { ...tech, status: statusOrder[nextIndex] };
      }
      return tech;
    }));
  };

  const markAllCompleted = () => {
    setTechnologies(prev => prev.map(tech => ({ ...tech, status: 'completed' })));
  };

  const resetAllStatuses = () => {
    setTechnologies(prev => prev.map(tech => ({ ...tech, status: 'not-started' })));
  };

  // НОВАЯ ФУНКЦИЯ: Полный сброс ВСЕХ данных - статусы и заметки
  const resetAllData = () => {
    // Сбрасываем ВСЕ технологии к "not-started" и очищаем заметки
    const resetTechnologies = initialTechnologies.map(tech => ({
      ...tech,
      status: 'not-started', // ВСЕ статусы на "не начато"
      notes: '' // ВСЕ заметки очищаем
    }));
    setTechnologies(resetTechnologies);
  };

  const progress = technologies.length > 0 
    ? Math.round((technologies.filter(t => t.status === 'completed').length / technologies.length) * 100)
    : 0;

  const value = {
    technologies,
    updateNotes,
    toggleStatus,
    markAllCompleted,
    resetAllStatuses,
    resetAllData,
    progress
  };

  return (
    <TechnologiesContext.Provider value={value}>
      {children}
    </TechnologiesContext.Provider>
  );
}

export const useTechnologies = () => useContext(TechnologiesContext);
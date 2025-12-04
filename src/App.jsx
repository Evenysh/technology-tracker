// src/App.jsx
import './App.css';
import { useState } from 'react';
import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';
import QuickActions from './components/QuickActions';
import FilterButtons from './components/FilterButtons'; // ← новый импорт

function App() {
  const [technologies, setTechnologies] = useState([
    { id: 1, title: 'React Components', description: 'Изучение базовых компонентов', status: 'not-started' },
    { id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status: 'not-started' },
    { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'not-started' },
    { id: 4, title: 'React Hooks', description: 'Изучение useState, useEffect', status: 'not-started' },
    { id: 5, title: 'React Router', description: 'Маршрутизация в React', status: 'not-started' }
  ]);

  const [activeFilter, setActiveFilter] = useState('all'); // ← состояние фильтра

  // Функция изменения статуса
  const updateTechnologyStatus = (id) => {
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

  // Фильтрация технологий по активному фильтру
  const filteredTechnologies = technologies.filter(tech => {
    if (activeFilter === 'all') return true;
    return tech.status === activeFilter;
  });

  return (
    <div className="App">
      <h1>Трекер изучения технологий</h1>
      
      <ProgressHeader technologies={technologies} />
      
      <QuickActions 
        technologies={technologies} 
        setTechnologies={setTechnologies} 
      />

      <FilterButtons 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      
      <div className="technologies-list">
        {filteredTechnologies.map(tech => (  // ← используем filteredTechnologies
          <TechnologyCard
            key={tech.id}
            id={tech.id}
            title={tech.title}
            description={tech.description}
            status={tech.status}
            onStatusChange={updateTechnologyStatus}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
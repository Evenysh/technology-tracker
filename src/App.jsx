// src/App.jsx
import './App.css';
import { useState, useEffect } from 'react';
import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';
import QuickActions from './components/QuickActions';
import FilterButtons from './components/FilterButtons';

function App() {
  // ========== ЛЕНИВАЯ ИНИЦИАЛИЗАЦИЯ ==========
  const [technologies, setTechnologies] = useState(() => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      return JSON.parse(saved);
    }
    
    return [
      { id: 1, title: 'React Components', description: 'Изучение базовых компонентов', status: 'not-started', notes: '' },
      { id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status: 'not-started', notes: '' },
      { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'not-started', notes: '' },
      { id: 4, title: 'React Hooks', description: 'Изучение useState, useEffect', status: 'not-started', notes: '' },
      { id: 5, title: 'React Router', description: 'Маршрутизация в React', status: 'not-started', notes: '' }
    ];
  });

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ========== ТОЛЬКО СОХРАНЕНИЕ ==========
  useEffect(() => {
    localStorage.setItem('techTrackerData', JSON.stringify(technologies));
  }, [technologies]);

  // ========== ФУНКЦИИ ==========
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

  const updateTechnologyNotes = (techId, newNotes) => {
    setTechnologies(prevTech =>
      prevTech.map(tech =>
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  // ========== ФИЛЬТРАЦИЯ ==========
  const statusFilteredTechnologies = technologies.filter(tech => {
    if (activeFilter === 'all') return true;
    return tech.status === activeFilter;
  });

  const filteredTechnologies = statusFilteredTechnologies.filter(tech =>
    tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="App">
      <h1>Трекер изучения технологий</h1>
      
      <ProgressHeader technologies={technologies} />
      
      <QuickActions 
        technologies={technologies} 
        setTechnologies={setTechnologies} 
      />

      <div className="search-box" style={{ 
        margin: '20px 0', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px' 
      }}>
        <input
          type="text"
          placeholder="Поиск технологий..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '10px',
            width: '300px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginRight: '10px'
          }}
        />
        <span style={{ color: '#666' }}>
          Найдено: <strong>{filteredTechnologies.length}</strong> из {technologies.length}
        </span>
      </div>

      <FilterButtons 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      
      <div className="technologies-list">
        {filteredTechnologies.map(tech => (
          <TechnologyCard
            key={tech.id}
            id={tech.id}
            title={tech.title}
            description={tech.description}
            status={tech.status}
            notes={tech.notes}
            onStatusChange={updateTechnologyStatus}
            onNotesChange={updateTechnologyNotes}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
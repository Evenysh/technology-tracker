// src/App.jsx
import './App.css';
import { useState } from 'react';
import useTechnologies from './hooks/useTechnologies';
import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';
import QuickActions from './components/QuickActions';
import FilterButtons from './components/FilterButtons';

function App() {
  const {
    technologies,
    updateNotes,
    toggleStatus,
    markAllCompleted,
    resetAllStatuses,
    progress
  } = useTechnologies();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
      <header className="app-header">
        <h1>Трекер изучения технологий</h1>
        {/* Прогресс-бар убран из шапки — он есть в ProgressHeader ниже */}
      </header>

      {/* Здесь ProgressHeader показывает прогресс с градиентом */}
      <ProgressHeader technologies={technologies} />
      
      <QuickActions 
        technologies={technologies}
        onMarkAllCompleted={markAllCompleted}
        onResetAll={resetAllStatuses}
        onToggleStatus={toggleStatus}
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
            onStatusChange={toggleStatus}
            onNotesChange={updateNotes}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
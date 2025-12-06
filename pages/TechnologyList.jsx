// src/pages/TechnologyList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TechnologyCard from '../components/TechnologyCard';
import ProgressHeader from '../components/ProgressHeader';
import FilterButtons from '../components/FilterButtons';
import QuickActions from '../components/QuickActions';
import useTechnologies from '../hooks/useTechnologies';
import './TechnologyList.css';

function TechnologyList() {
  const { 
    technologies, 
    updateStatus, 
    updateNotes,
    progress 
  } = useTechnologies();
  
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация технологий
  const filteredTechnologies = technologies.filter(tech => {
    // Фильтр по статусу
    if (filter !== 'all' && tech.status !== filter) {
      return false;
    }
    
    // Поиск по названию и описанию
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return tech.title.toLowerCase().includes(query) || 
             tech.description.toLowerCase().includes(query);
    }
    
    return true;
  });

  // Функции для быстрых действий
  const handleMarkAllCompleted = () => {
    technologies.forEach(tech => {
      if (tech.status !== 'completed') {
        updateStatus(tech.id, 'completed');
      }
    });
  };

  const handleResetAll = () => {
    technologies.forEach(tech => {
      updateStatus(tech.id, 'not-started');
    });
  };

  return (
    <div className="technology-list-page">
      {/* Заголовок с прогрессом */}
      <ProgressHeader 
        technologies={technologies}
        progress={progress}
      />

      {/* Панель поиска и фильтров */}
      <div className="controls-panel">
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Поиск технологий..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-count">
            Найдено: {filteredTechnologies.length}
          </span>
        </div>

        <FilterButtons 
          currentFilter={filter}
          onFilterChange={setFilter}
        />

        <Link to="/add-technology" className="btn btn-primary">
          + Добавить технологию
        </Link>
      </div>

      {/* Быстрые действия */}
      <QuickActions 
        technologies={technologies}
        onMarkAllCompleted={handleMarkAllCompleted}
        onResetAll={handleResetAll}
        onToggleStatus={updateStatus}
      />

      {/* Список технологий */}
      <div className="technologies-container">
        {filteredTechnologies.length > 0 ? (
          <div className="technologies-grid">
            {filteredTechnologies.map(tech => (
              <TechnologyCard
                key={tech.id}
                technology={tech}
                onStatusChange={updateStatus}
                onNotesChange={updateNotes}
                showDetailsLink={true}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>Технологий не найдено</h3>
            <p>
              {searchQuery 
                ? `По запросу "${searchQuery}" ничего не найдено`
                : filter !== 'all'
                  ? `Нет технологий со статусом "${filter}"`
                  : 'Пока нет добавленных технологий'
              }
            </p>
            <Link to="/add-technology" className="btn btn-primary">
              + Добавить первую технологию
            </Link>
          </div>
        )}
      </div>

      {/* Статистика внизу */}
      <div className="page-footer">
        <div className="footer-stats">
          <div className="stat-item">
            <span className="stat-label">Всего:</span>
            <span className="stat-value">{technologies.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Изучено:</span>
            <span className="stat-value completed">
              {technologies.filter(t => t.status === 'completed').length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">В процессе:</span>
            <span className="stat-value in-progress">
              {technologies.filter(t => t.status === 'in-progress').length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Не начато:</span>
            <span className="stat-value not-started">
              {technologies.filter(t => t.status === 'not-started').length}
            </span>
          </div>
        </div>
        <div className="footer-links">
          <Link to="/stats" className="footer-link">
            📊 Подробная статистика
          </Link>
          <Link to="/settings" className="footer-link">
            ⚙️ Настройки
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TechnologyList;
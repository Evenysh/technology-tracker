// src/App.jsx
import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useLanguage } from './contexts/LanguageContext';
import { useTechnologies } from './contexts/TechnologiesContext';
import { translations } from './i18n/translations';
import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';
import QuickActions from './components/QuickActions';
import FilterButtons from './components/FilterButtons';
import Navigation from './components/Navigation';
import Stats from '../pages/Stats';
import Settings from '../pages/Settings';
import { LanguageProvider } from './contexts/LanguageContext';
import { TechnologiesProvider } from './contexts/TechnologiesContext';
import ApiSearch from './components/ApiSearch';

// Создаём отдельный компонент для контента приложения
function AppContent() {
  const { language } = useLanguage();
  const t = translations[language];
  
  const {
    technologies,
    updateNotes,
    toggleStatus,
    markAllCompleted,
    resetAllStatuses,
    removeTechnology,
    progress
  } = useTechnologies();

  // Применяем сохранённую тему при загрузке
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
      }
    }
  }, []);

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
      <Navigation />
      
      <Routes>
        {/* РЕДИРЕКТ с корня на главную страницу */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/api-search" element={<ApiSearch />} />
        
        {/* Главная страница */}
        <Route path="/home" element={
          <div>
            <ProgressHeader technologies={technologies} />
            
            <QuickActions 
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
                placeholder={t.home.searchPlaceholder}
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
                {t.home.found}: <strong>{filteredTechnologies.length}</strong> {t.home.of} {technologies.length}
              </span>
            </div>

            <FilterButtons 
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
            
            <div className="technologies-list">
              {filteredTechnologies.length > 0 ? (
                filteredTechnologies.map(tech => (
                  <TechnologyCard
                    key={tech.id}
                    id={tech.id}
                    title={tech.title}
                    description={tech.description}
                    status={tech.status}
                    notes={tech.notes}
                    // ВАЖНО: ПЕРЕДАЕМ ВСЕ НОВЫЕ ПОЛЯ ДЛЯ СРОКОВ!
                    startDate={tech.startDate}
                    deadline={tech.deadline}
                    estimatedHours={tech.estimatedHours}
                    priority={tech.priority}
                    deadlineNotes={tech.deadlineNotes}
                    onStatusChange={toggleStatus}
                    onNotesChange={updateNotes}
                    onDelete={removeTechnology}
                  />
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                  {t.home.noTechnologies}
                </p>
              )}
            </div>
          </div>
        } />
        
        {/* Страница статистики */}
        <Route path="/stats" element={<Stats />} />
        
        {/* Страница настроек */}
        <Route path="/settings" element={<Settings />} />

        {/* Fallback маршрут для несуществующих путей */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
}

// Основной компонент App, который оборачивает всё в провайдеры
function App() {
  return (
    <Router>
      <TechnologiesProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </TechnologiesProvider>
    </Router>
  );
}

export default App;
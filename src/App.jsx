// src/App.jsx
import './App.css';
import { useState, useEffect } from 'react';
import {
  HashRouter as Router,   // ✅ ВАЖНО: HashRouter вместо BrowserRouter
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { useLanguage } from './contexts/LanguageContext';
import { useTechnologies } from './contexts/TechnologiesContext';
import { useThemeMode } from './contexts/ThemeContext';
import { translations } from './i18n/translations';

import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';
import QuickActions from './components/QuickActions';
import FilterButtons from './components/FilterButtons';
import Navigation from './components/Navigation';
import Notification from './components/Notification';
import ApiSearch from './components/ApiSearch';

import Stats from '../pages/Stats';
import Settings from '../pages/Settings';

import { LanguageProvider } from './contexts/LanguageContext';
import { TechnologiesProvider } from './contexts/TechnologiesContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider as AppThemeProvider } from './contexts/ThemeContext';

// MUI Theme
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from './theme/muiTheme';

function AppContent() {
  const { language } = useLanguage();
  const t = translations[language];

  const { theme } = useThemeMode();
  const muiTheme = getMuiTheme(theme);

  const {
    technologies,
    updateNotes,
    toggleStatus,
    markAllCompleted,
    resetAllStatuses,
    removeTechnology
  } = useTechnologies();

  useEffect(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
      }
    }
  }, []);

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const statusFiltered = technologies.filter((tech) =>
    activeFilter === 'all' ? true : tech.status === activeFilter
  );

  const filteredTechnologies = statusFiltered.filter((tech) =>
    tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MuiThemeProvider theme={muiTheme}>
      <div className="App">
        <Navigation />
        <Notification />

        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/api-search" element={<ApiSearch />} />

          <Route
            path="/home"
            element={
              <div>
                <ProgressHeader technologies={technologies} />

                <QuickActions
                  onMarkAllCompleted={markAllCompleted}
                  onResetAll={resetAllStatuses}
                  onToggleStatus={toggleStatus}
                />

                <div
                  className="search-box"
                  style={{
                    margin: '20px 0',
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px'
                  }}
                >
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
                    {t.home.found}:{' '}
                    <strong>{filteredTechnologies.length}</strong> {t.home.of}{' '}
                    {technologies.length}
                  </span>
                </div>

                <FilterButtons
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                />

                <div className="technologies-list">
                  {filteredTechnologies.length > 0 ? (
                    filteredTechnologies.map((tech) => (
                      <TechnologyCard
                        key={tech.id}
                        id={tech.id}
                        title={tech.title}
                        description={tech.description}
                        status={tech.status}
                        notes={tech.notes}
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
                    <p
                      style={{
                        textAlign: 'center',
                        color: '#666',
                        padding: '40px'
                      }}
                    >
                      {t.home.noTechnologies}
                    </p>
                  )}
                </div>
              </div>
            }
          />

          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <NotificationProvider>
        <TechnologiesProvider>
          <LanguageProvider>
            <AppThemeProvider>
              <AppContent />
            </AppThemeProvider>
          </LanguageProvider>
        </TechnologiesProvider>
      </NotificationProvider>
    </Router>
  );
}

export default App;

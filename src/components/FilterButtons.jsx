// src/components/FilterButtons.jsx
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../i18n/translations';
import './FilterButtons.css';

function FilterButtons({ activeFilter, onFilterChange }) {
  const { language } = useLanguage();
  const t = translations[language];

  const filters = [
    { key: 'all', label: t.home.filterAll },
    { key: 'not-started', label: t.home.filterNotStarted },
    { key: 'in-progress', label: t.home.filterInProgress },
    { key: 'completed', label: t.home.filterCompleted }
  ];

  return (
    <div className="filter-buttons">
      {filters.map(filter => (
        <button
          key={filter.key}
          className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.key)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export default FilterButtons;
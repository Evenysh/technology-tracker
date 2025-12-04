// src/components/FilterButtons.jsx
import './FilterButtons.css';

function FilterButtons({ activeFilter, onFilterChange }) {
  const filters = [
    { key: 'all', label: 'Все' },
    { key: 'not-started', label: 'Не начаты' },
    { key: 'in-progress', label: 'В процессе' },
    { key: 'completed', label: 'Выполнены' }
  ];

  return (
    <div className="filter-buttons">
      <h3>Фильтр по статусу:</h3>
      <div className="filter-options">
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
    </div>
  );
}

export default FilterButtons;
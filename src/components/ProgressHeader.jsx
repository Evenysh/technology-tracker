// src/components/ProgressHeader.jsx
import './ProgressHeader.css';

function ProgressHeader({ technologies }) {
  // Подсчёт статистики
  const total = technologies.length;
  const completed = technologies.filter(tech => tech.status === 'completed').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="progress-header">
      <h2>Прогресс изучения</h2>
      
      <div className="stats">
        <div className="stat">
          <span className="stat-label">Всего технологий:</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Изучено:</span>
          <span className="stat-value">{completed}</span>
        </div>
        <div className="stat">
          <span className="stat-label">В процессе:</span>
          <span className="stat-value">{technologies.filter(tech => tech.status === 'in-progress').length}</span>
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar-label">
          Прогресс: <strong>{percentage}%</strong>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-bar-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="progress-text">
          {completed} из {total} технологий изучено
        </div>
      </div>
    </div>
  );
}

export default ProgressHeader;
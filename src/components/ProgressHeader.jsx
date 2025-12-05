// src/components/ProgressHeader.jsx
import './ProgressHeader.css';
import ProgressBar from './ProgressBar';

function ProgressHeader({ technologies }) {
  // Подсчёт статистики
  const total = technologies.length;
  const completed = technologies.filter(tech => tech.status === 'completed').length;
  const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
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
          <span className="stat-value">{inProgress}</span>
        </div>
      </div>

      {/* Используем переиспользуемый ProgressBar */}
      <ProgressBar
        progress={percentage}
        label="Общий прогресс"
        color="#8a2be2"
        height={20}
        animated={true}
        showPercentage={true}
        className="main-progress-bar"
      />

      <div className="progress-text">
        {completed} из {total} технологий изучено
      </div>
    </div>
  );
}

export default ProgressHeader;
// src/components/ProgressBar.jsx
import './ProgressBar.css';

function ProgressBar({
  progress,           // Текущее значение прогресса (0-100)
  label = '',        // Подпись
  color = '#8a2be2', // Цвет заполнения (фиолетовый по умолчанию)
  height = 20,       // Высота
  showPercentage = true, // Показывать процент
  animated = false,  // Анимация
  className = ''     // Дополнительные классы
}) {
  // Ограничиваем прогресс 0-100
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`progress-bar-component ${className}`}>
      {/* Заголовок с лейблом и процентом */}
      {(label || showPercentage) && (
        <div className="progress-bar-header">
          {label && <span className="progress-label">{label}</span>}
          {showPercentage && (
            <span className="progress-percentage">{normalizedProgress}%</span>
          )}
        </div>
      )}

      {/* Прогресс-бар */}
      <div 
        className="progress-bar-outer"
        style={{ height: `${height}px` }}
      >
        <div 
          className={`progress-bar-inner ${animated ? 'animated' : ''}`}
          style={{
            width: `${normalizedProgress}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
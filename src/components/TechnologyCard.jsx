// src/components/TechnologyCard.jsx
import './TechnologyCard.css';

function TechnologyCard({ id, title, description, status, onStatusChange }) {
  // Функция-обработчик клика по карточке
  const handleClick = () => {
    if (onStatusChange) {
      onStatusChange(id); // Передаём id карточки в функцию из App
    }
  };

  // Текст для статуса
  const statusText = {
    'not-started': 'Не начато',
    'in-progress': 'В процессе',
    'completed': 'Изучено'
  };

  return (
    <div 
      className={`technology-card ${status}`}
      onClick={handleClick}
      title="Кликните, чтобы изменить статус"
    >
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="status-indicator">
        Статус: {statusText[status]}
      </div>
    </div>
  );
}

export default TechnologyCard;
// src/components/TechnologyCard.jsx
import './TechnologyCard.css';

function TechnologyCard({ title, description, status }) {
  return (
    <div className={`technology-card ${status}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="status-indicator">
        Статус: {status === 'completed' ? 'Изучено' : 
                status === 'in-progress' ? 'В процессе' : 'Не начато'}
      </div>
    </div>
  );
}

export default TechnologyCard;
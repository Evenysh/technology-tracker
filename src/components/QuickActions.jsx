// src/components/QuickActions.jsx
import './QuickActions.css';

function QuickActions({ technologies, setTechnologies }) {
  // 1. Отметить все как выполненные
  const markAllAsCompleted = () => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  // 2. Сбросить все статусы
  const resetAllStatuses = () => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

  // 3. Случайный выбор следующей технологии (только not-started)
  const pickRandomTechnology = () => {
    const notStartedTechs = technologies.filter(tech => tech.status === 'not-started');
    
    if (notStartedTechs.length === 0) {
      alert('Все технологии уже начаты или завершены!');
      return;
    }

    const randomTech = notStartedTechs[Math.floor(Math.random() * notStartedTechs.length)];
    
    // Меняем статус выбранной технологии на "in-progress"
    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === randomTech.id ? { ...tech, status: 'in-progress' } : tech
      )
    );

    alert(`Выбрана технология: "${randomTech.title}"! Статус изменён на "В процессе".`);
  };

  return (
    <div className="quick-actions">
      <h3>⚡ Быстрые действия</h3>
      <div className="actions-buttons">
        <button onClick={markAllAsCompleted} className="action-btn complete-all">
          ✅ Отметить все как выполненные
        </button>
        <button onClick={resetAllStatuses} className="action-btn reset-all">
          🔄 Сбросить все статусы
        </button>
        <button onClick={pickRandomTechnology} className="action-btn random-pick">
          🎲 Случайный выбор следующей технологии
        </button>
      </div>
      <p className="actions-hint">
        <small>Количество не начатых: {technologies.filter(t => t.status === 'not-started').length}</small>
      </p>
    </div>
  );
}

export default QuickActions;
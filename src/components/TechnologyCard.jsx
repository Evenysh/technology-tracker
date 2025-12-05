// src/components/TechnologyCard.jsx
import './TechnologyCard.css';
import { useState } from 'react'; // для локального состояния

function TechnologyCard({ 
  id, 
  title, 
  description, 
  status, 
  notes, // пропс notes
  onStatusChange, 
  onNotesChange // пропс для обновления заметок
}) {
  // Локальное состояние для показа/скрытия заметок
  const [showNotes, setShowNotes] = useState(false);

  // Функция-обработчик клика по карточке (для смены статуса)
  const handleClick = () => {
    if (onStatusChange) {
      onStatusChange(id);
    }
  };

  // Функция для изменения заметок
  const handleNotesChange = (e) => {
    console.log('✏️ TechnologyCard: handleNotesChange', { id, value: e.target.value });
    if (onNotesChange) {
      onNotesChange(id, e.target.value);
    } else {
      console.error('❌ onNotesChange не передан в TechnologyCard!');
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
      title="Кликните, чтобы изменить статус"
    >
      {/* Обёртка для кликабельной области статуса */}
      <div className="card-main" onClick={handleClick}>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="status-indicator">
          Статус: {statusText[status]}
        </div>
      </div>

      {/* ========== СЕКЦИЯ ЗАМЕТОК ========== */}
      <div className="notes-section">
        <button 
          className="notes-toggle"
          onClick={() => setShowNotes(!showNotes)}
        >
          {showNotes ? 'Скрыть заметки' : 'Показать заметки'} 
          {notes && ` (${notes.length} симв.)`}
        </button>

        {showNotes && (
          <div className="notes-editor">
            <h4>Мои заметки:</h4>
            <textarea
              value={notes || ''}
              onChange={handleNotesChange}
              placeholder="Записывайте сюда важные моменты..."
              rows="3"
            />
            <div className="notes-hint">
              {notes && notes.length > 0 
                ? `Заметка сохранена (${notes.length} символов)` 
                : 'Добавьте заметку. Она сохранится автоматически.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TechnologyCard;
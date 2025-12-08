// src/components/TechnologyCard.jsx
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../i18n/translations';
import './TechnologyCard.css';

function TechnologyCard({ 
  id, 
  title, 
  description, 
  status, 
  notes, 
  onStatusChange, 
  onNotesChange,
  onDelete
}) {
  const { language } = useLanguage();
  const t = translations[language].technologyCard;
  const [showNotes, setShowNotes] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Клик по карточке меняет статус
  const handleCardClick = (e) => {
    // Если клик был по кнопке удаления или textarea - не меняем статус
    if (e.target.closest('.delete-btn') || e.target.tagName === 'TEXTAREA') {
      return;
    }
    onStatusChange(id);
  };

  const handleNotesChange = (e) => {
    onNotesChange(id, e.target.value);
  };

  // Функция для удаления технологии (останавливает всплытие события)
  const handleDelete = (e) => {
    e.stopPropagation(); // Останавливаем всплытие, чтобы не сработал handleCardClick
    
    if (!window.confirm(language === 'ru' 
      ? `Вы уверены, что хотите удалить технологию "${title}"?`
      : `Are you sure you want to delete technology "${title}"?`
    )) {
      return;
    }

    setIsDeleting(true);
    try {
      onDelete(id);
      
      if (language === 'ru') {
        alert(`✅ Технология "${title}" успешно удалена!`);
      } else {
        alert(`✅ Technology "${title}" successfully deleted!`);
      }
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      if (language === 'ru') {
        alert('❌ Ошибка при удалении технологии');
      } else {
        alert('❌ Error deleting technology');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Клик по кнопке заметок (останавливает всплытие)
  const handleNotesToggle = (e) => {
    e.stopPropagation();
    setShowNotes(!showNotes);
  };

  const getStatusText = () => {
    switch(status) {
      case 'not-started': return t.notStarted;
      case 'in-progress': return t.inProgress;
      case 'completed': return t.completed;
      default: return status;
    }
  };

  return (
    <div 
      className={`technology-card ${status} ${isDeleting ? 'deleting' : ''}`}
      onClick={handleCardClick}
      title={t.clickToChangeStatus}
    >
      <div className="card-header">
        <h3>{title}</h3>
        <div className="header-right">
          <span className="status-indicator">
            {getStatusText()}
          </span>
          <button 
            className="delete-btn"
            onClick={handleDelete}
            disabled={isDeleting}
            title={language === 'ru' ? 'Удалить технологию' : 'Delete technology'}
          >
            {isDeleting ? '🗑️...' : '🗑️'}
          </button>
        </div>
      </div>

      <p className="description">{description}</p>

      <div className="notes-section">
        <button 
          className="notes-toggle"
          onClick={handleNotesToggle}
        >
          {showNotes ? t.hideNotes : t.showNotes}
        </button>
        
        {showNotes && (
          <div className="notes-editor" onClick={(e) => e.stopPropagation()}>
            <h4>{t.myNotes}</h4>
            <textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder={t.notesPlaceholder}
              rows="3"
            />
            <div className="notes-hint">
              {notes.length > 0 
                ? `${t.notesSaved} (${notes.length} ${language === 'ru' ? 'символов' : 'chars'})` 
                : t.addNote
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TechnologyCard;
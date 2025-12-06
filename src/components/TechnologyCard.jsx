// src/components/TechnologyCard.jsx
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../i18n/translations';
import './TechnologyCard.css';
import { useState } from 'react';

function TechnologyCard({ 
  id, 
  title, 
  description, 
  status, 
  notes,
  onStatusChange, 
  onNotesChange
}) {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [showNotes, setShowNotes] = useState(false);

  const handleClick = () => {
    if (onStatusChange) {
      onStatusChange(id);
    }
  };

  const handleNotesChange = (e) => {
    if (onNotesChange) {
      onNotesChange(id, e.target.value);
    }
  };

  const statusText = {
    'not-started': t.technologyCard.notStarted,
    'in-progress': t.technologyCard.inProgress,
    'completed': t.technologyCard.completed
  };

  const currentStatus = status || 'not-started';

  return (
    <div 
      className={`technology-card ${currentStatus}`}
      title={t.technologyCard.clickToChangeStatus}
    >
      <div className="card-main" onClick={handleClick}>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="status-indicator">
          {t.technologyCard.status}: {statusText[currentStatus] || t.technologyCard.notStarted}
        </div>
      </div>

      <div className="notes-section">
        <button 
          className="notes-toggle"
          onClick={() => setShowNotes(!showNotes)}
        >
          {showNotes ? t.technologyCard.hideNotes : t.technologyCard.showNotes} 
          {notes && ` (${notes.length} ${language === 'ru' ? 'симв.' : 'char.'})`}
        </button>

        {showNotes && (
          <div className="notes-editor">
            <h4>{t.technologyCard.myNotes}</h4>
            <textarea
              value={notes || ''}
              onChange={handleNotesChange}
              placeholder={t.technologyCard.notesPlaceholder}
              rows="3"
            />
            <div className="notes-hint">
              {notes && notes.length > 0 
                ? `${t.technologyCard.notesSaved} (${notes.length} ${language === 'ru' ? 'символов' : 'characters'})` 
                : t.technologyCard.addNote}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TechnologyCard;
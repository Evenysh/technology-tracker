import { useState, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTechnologies } from '../contexts/TechnologiesContext';
import Modal from './Modal';
import DeadlineForm from './DeadlineForm';
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
  onDelete,
  startDate,
  deadline,
  estimatedHours,
  priority,
  deadlineNotes,        // заметки по срокам
  // для массового редактирования
  isSelected = false,
  onSelect = () => {},
  bulkEditMode = false
}) {
  const { language } = useLanguage();
  const { updateDeadline, getDeadlineProgress } = useTechnologies();
  const dict = translations[language];
  const t = dict.technologyCard;

  const [showNotes, setShowNotes] = useState(false);
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ---------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ----------

  const formatDate = useCallback(
    (dateStr) => {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      } catch {
        return dateStr;
      }
    },
    [language]
  );

  const getPriorityText = useCallback(
    (value) => {
      if (language === 'ru') {
        switch (value) {
          case 'critical':
            return 'Критический';
          case 'high':
            return 'Высокий';
          case 'medium':
            return 'Средний';
          case 'low':
            return 'Низкий';
          default:
            return value;
        }
      } else {
        switch (value) {
          case 'critical':
            return 'Critical';
          case 'high':
            return 'High';
          case 'medium':
            return 'Medium';
          case 'low':
            return 'Low';
          default:
            return value;
        }
      }
    },
    [language]
  );

  const getPriorityColor = useCallback((value) => {
    // как ты просила: чёрный, тёмно-графитовый, графитовый, серый
    switch (value) {
      case 'critical':
        return '#000000';   // чёрный
      case 'high':
        return '#1f2127';   // тёмно-графитовый
      case 'medium':
        return '#444753';   // графитовый
      case 'low':
        return '#7f838c';   // серый
      default:
        return '#777777';
    }
  }, []);

  const currentProgress = getDeadlineProgress({ startDate, deadline });

  const getDeadlineStatus = useCallback(() => {
    if (!startDate || !deadline) return 'not-set';

    const now = new Date();
    const end = new Date(deadline);

    if (now > end) return 'overdue';
    if (currentProgress > 80) return 'urgent';
    if (currentProgress > 50) return 'halfway';
    if (currentProgress > 0) return 'in-progress';
    return 'not-started';
  }, [startDate, deadline, currentProgress]);

  const getDeadlineIcon = useCallback(() => {
    const st = getDeadlineStatus();
    switch (st) {
      case 'overdue':
        return '⏰⚠️';
      case 'urgent':
        return '⏰';
      case 'halfway':
      case 'in-progress':
      case 'not-started':
        return '📅';
      default:
        return '📅';
    }
  }, [getDeadlineStatus]);

  const getDeadlineStatusText = useCallback(() => {
    const st = getDeadlineStatus();
    if (language === 'ru') {
      switch (st) {
        case 'overdue':
          return 'Просрочено ⚠️';
        case 'urgent':
          return 'Срочно ⚠️';
        case 'halfway':
          return 'Половина пройдена';
        case 'in-progress':
          return 'В процессе';
        case 'not-started':
          return 'Ещё не начато';
        default:
          return 'Не установлено';
      }
    } else {
      switch (st) {
        case 'overdue':
          return 'Overdue ⚠️';
        case 'urgent':
          return 'Urgent ⚠️';
        case 'halfway':
          return 'Halfway done';
        case 'in-progress':
          return 'In progress';
        case 'not-started':
          return 'Not started';
        default:
          return 'Not set';
      }
    }
  }, [getDeadlineStatus, language]);

  // 🔥 Главная фикса: корректные статусы на выбранном языке
  const getStatusText = useCallback(() => {
    const map = {
      'not-started': 'notStarted',
      'in-progress': 'inProgress',
      completed: 'completed',
    };
    const key = map[status] || status;
    const dictCard = dict.technologyCard;

    return dictCard[key] || status;
  }, [status, dict]);

  // ---------- ХЕНДЛЕРЫ ----------

  const handleCardClick = (e) => {
    // Режим массового выбора
    if (bulkEditMode) {
      if (
        e.target.closest('.action-btn') ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.type === 'checkbox'
      ) {
        return;
      }
      onSelect(id, !isSelected);
      return;
    }

    // Обычное поведение
    if (
      e.target.closest('.action-btn') ||
      e.target.tagName === 'TEXTAREA'
    ) {
      return;
    }
    onStatusChange(id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    const msgRu = `Вы уверены, что хотите удалить технологию "${title}"?`;
    const msgEn = `Are you sure you want to delete technology "${title}"?`;

    if (!window.confirm(language === 'ru' ? msgRu : msgEn)) return;

    setIsDeleting(true);
    try {
      onDelete(id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveDeadline = (deadlineData) => {
    updateDeadline(id, deadlineData);
    setShowDeadlineModal(false);
  };

  const handleNotesToggle = (e) => {
    e.stopPropagation();
    setShowNotes((prev) => !prev);
  };

  const handleNotesChange = (e) => {
    onNotesChange(id, e.target.value);
  };

  const handleSelectToggle = (e) => {
    e.stopPropagation();
    onSelect(id, !isSelected);
  };

  // ---------- РЕНДЕР ----------

  return (
    <>
      <div
        className={`technology-card ${status} ${
          isDeleting ? 'deleting' : ''
        } ${isSelected ? 'selected' : ''} ${
          bulkEditMode ? 'bulk-edit-mode' : ''
        }`}
        onClick={handleCardClick}
        title={
          bulkEditMode
            ? isSelected
              ? 'Снять выделение'
              : 'Выбрать карточку'
            : t.clickToChangeStatus
        }
      >
        {bulkEditMode && (
          <div className="selection-checkbox" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              id={`tech-select-${id}`}
              checked={isSelected}
              onChange={handleSelectToggle}
              className="tech-checkbox"
            />
            <label htmlFor={`tech-select-${id}`} className="sr-only">
              {language === 'ru'
                ? `Выбрать технологию ${title}`
                : `Select technology ${title}`}
            </label>
          </div>
        )}

        <div className="card-header">
          <h3>{title}</h3>

          <div className="header-right">
            <span className="status-indicator">{getStatusText()}</span>

            <button
              className="action-btn deadline-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeadlineModal(true);
              }}
              title={
                language === 'ru' ? 'Установить сроки изучения' : 'Set deadline'
              }
            >
              📅
            </button>

            <button
              className="action-btn delete-btn"
              onClick={handleDelete}
              title={language === 'ru' ? 'Удалить технологию' : 'Delete'}
            >
              🗑️
            </button>
          </div>
        </div>

        <p className="description">{description}</p>

        {(startDate || deadline || estimatedHours || priority) && (
          <div
            className="deadline-info"
            onClick={(e) => e.stopPropagation()}
          >
            {startDate && (
              <span className="deadline-item">
                <strong>{t.startDate}:</strong> {formatDate(startDate)}
              </span>
            )}

            {deadline && (
              <span className="deadline-item">
                <strong>{t.deadline}:</strong> {formatDate(deadline)}
                <span
                  className={`deadline-status ${getDeadlineStatus()}`}
                  title={getDeadlineStatusText()}
                >
                  {getDeadlineIcon()} {getDeadlineStatusText()}
                </span>
              </span>
            )}

            {estimatedHours > 0 && (
              <span className="deadline-item">
                <strong>{t.estimatedHours}:</strong> {Number(estimatedHours)}
              </span>
            )}

            {priority && (
              <span className="deadline-item">
                <strong>{t.priority}: </strong>
                <span
                  className="priority-badge"
                  style={{
                    backgroundColor: getPriorityColor(priority),
                    color: '#ffffff',
                  }}
                >
                  {getPriorityText(priority)}
                </span>
              </span>
            )}
          </div>
        )}

        {/* Блок заметок + заметки по срокам */}
        <div className="notes-section">
          <button
            className="notes-toggle"
            onClick={handleNotesToggle}
            aria-expanded={showNotes}
          >
            {showNotes ? t.hideNotes : t.showNotes}
          </button>

          {showNotes && (
            <div
              className="notes-editor"
              onClick={(e) => e.stopPropagation()}
            >
              <h4>{t.myNotes}</h4>
              <textarea
                value={notes}
                onChange={handleNotesChange}
                placeholder={t.notesPlaceholder}
                rows="3"
              />

              {deadlineNotes && (
                <div className="deadline-notes-block">
                  <div className="deadline-notes-title">
                    🕓 {language === 'ru' ? 'Заметки по срокам' : 'Deadline notes'}
                  </div>
                  <div className="deadline-notes-text">
                    {deadlineNotes}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showDeadlineModal && (
        <Modal
          isOpen={showDeadlineModal}
          onClose={() => setShowDeadlineModal(false)}
          title={
            language === 'ru'
              ? 'Установить сроки изучения'
              : 'Set Learning Deadline'
          }
        >
          <DeadlineForm
            technology={{ id, title, description }}
            initialData={{
              startDate: startDate || '',
              deadline: deadline || '',
              estimatedHours: estimatedHours || '',
              priority: priority || 'medium',
              // ВАЖНО: сюда передаём заметки по срокам
              notes: deadlineNotes || '',
            }}
            onSave={handleSaveDeadline}
            onCancel={() => setShowDeadlineModal(false)}
          />
        </Modal>
      )}
    </>
  );
}

export default TechnologyCard;

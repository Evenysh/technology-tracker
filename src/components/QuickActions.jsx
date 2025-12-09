// src/components/QuickActions.jsx
import './QuickActions.css';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTechnologies } from '../contexts/TechnologiesContext';
import { translations } from '../i18n/translations';
import Modal from './Modal';
import BulkStatusEditor from './BulkStatusEditor';

function QuickActions({ 
  onMarkAllCompleted, 
  onResetAll,
  onToggleStatus
}) {
  const { language } = useLanguage();
  const { technologies, bulkUpdateStatuses } = useTechnologies();
  const t = translations[language];
  const qa = t.quickActions || {};

  const [showExportModal, setShowExportModal] = useState(false);
  const [showBulkEditor, setShowBulkEditor] = useState(false);

  // Статистика
  const notStartedCount = technologies.filter(t => t.status === 'not-started').length;
  const completedCount = technologies.filter(t => t.status === 'completed').length;
  const inProgressCount = technologies.filter(t => t.status === 'in-progress').length;

  // Сохранение для массового редактора
  const handleBulkSave = async (changes) => {
    try {
      await bulkUpdateStatuses(changes);
      setShowBulkEditor(false);
      const msg = (qa.bulkUpdateSuccess || 'Успешно обновлено {count} технологий')
        .replace('{count}', changes.length);
      alert(msg);
    } catch (err) {
      alert(qa.bulkUpdateError || 'Ошибка при обновлении статусов');
    }
  };

  // Экспорт
  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      count: technologies.length,
      technologies
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = `export-${new Date().toISOString().slice(0,10)}.json`;
    link.click();

    setShowExportModal(true);
  };

  // Случайный выбор
  const pickRandom = () => {
    const pool = technologies.filter(t => t.status === 'not-started');
    if (pool.length === 0) {
      alert(qa.noNotStarted || 'Нет технологий со статусом "Не начато"');
      return;
    }

    const random = pool[Math.floor(Math.random() * pool.length)];
    onToggleStatus(random.id);
    alert(`${qa.randomPickedPrefix || 'Вы выбрали: '}${random.title}`);
  };

  return (
    <div className="quick-actions">
      <h3>{qa.title || 'Быстрые действия'}</h3>

      <div className="actions-buttons">
        <button className="action-btn btn-primary" onClick={onMarkAllCompleted}>
          {qa.markAllCompleted || 'Отметить все как выполненные'}
        </button>

        <button className="action-btn btn-secondary" onClick={onResetAll}>
          {qa.resetAll || 'Сбросить статусы'}
        </button>

        <button className="action-btn btn-accent" onClick={handleExport}>
          {qa.exportData || 'Экспорт данных'}
        </button>

        <button className="action-btn btn-special" onClick={pickRandom}>
          {qa.randomPick || 'Случайный выбор'}
        </button>
      </div>

      {/* Кнопка массового редактирования */}
      <div className="bulk-edit-wrapper">
        <button className="bulk-edit-btn" onClick={() => setShowBulkEditor(true)}>
          {qa.bulkEdit || 'Массовое редактирование'}
        </button>
      </div>

      <div className="quick-stats">
        <div className="stat-item">
          <span className="stat-label">{qa.completed || 'Завершено'}</span>
          <span className="stat-value stat-completed">{completedCount}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">{qa.inProgress || 'В процессе'}</span>
          <span className="stat-value stat-in-progress">{inProgressCount}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">{qa.notStarted || 'Не начато'}</span>
          <span className="stat-value stat-not-started">{notStartedCount}</span>
        </div>
      </div>

      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title={qa.exportTitle || 'Экспорт'}
      >
        <p>{qa.exportSuccess || 'Данные успешно экспортированы!'}</p>
      </Modal>

      <Modal
        isOpen={showBulkEditor}
        onClose={() => setShowBulkEditor(false)}
        title={qa.bulkEditTitle || 'Массовое редактирование'}
        size="large"
      >
        <BulkStatusEditor
          technologies={technologies}
          onSave={handleBulkSave}
          onCancel={() => setShowBulkEditor(false)}
        />
      </Modal>
    </div>
  );
}

export default QuickActions;

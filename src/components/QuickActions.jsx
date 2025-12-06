// src/components/QuickActions.jsx
import './QuickActions.css';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTechnologies } from '../contexts/TechnologiesContext';
import { translations } from '../i18n/translations';
import Modal from './Modal';

function QuickActions({ 
  onMarkAllCompleted, 
  onResetAll,
  onToggleStatus
}) {
  const { language } = useLanguage();
  const { technologies } = useTechnologies(); // ← ВОТ ТУТ ИМЯ 'technologies'
  const t = translations[language];
  
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Используем technologies из контекста
  const notStartedCount = technologies.filter(t => t.status === 'not-started').length;
  const completedCount = technologies.filter(t => t.status === 'completed').length;
  const inProgressCount = technologies.filter(t => t.status === 'in-progress').length;

  // Экспорт данных
  const handleExport = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalTechnologies: technologies.length,
      completed: completedCount,
      inProgress: inProgressCount,
      notStarted: notStartedCount,
      technologies: technologies.map(tech => ({
        title: tech.title,
        description: tech.description,
        status: tech.status,
        notes: tech.notes,
        category: tech.category || 'frontend'
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setShowExportModal(true);
  };

  // Случайный выбор следующей технологии
  const pickRandomTechnology = () => {
    const notStartedTechs = technologies.filter(tech => tech.status === 'not-started');
    
    if (notStartedTechs.length === 0) {
      alert(t.quickActions.allStarted);
      return;
    }

    const randomTech = notStartedTechs[Math.floor(Math.random() * notStartedTechs.length)];
    
    if (onToggleStatus) {
      onToggleStatus(randomTech.id);
      alert(`${t.quickActions.selectedTechnology}: "${randomTech.title}"! ${t.quickActions.statusChanged}.`);
    }
  };

  return (
    <div className="quick-actions">
      <h3>{t.quickActions.title}</h3>
      
      <div className="actions-buttons">
        <button onClick={onMarkAllCompleted} className="action-btn btn-primary">
          {t.quickActions.markAllCompleted}
        </button>
        <button onClick={onResetAll} className="action-btn btn-secondary">
          {t.quickActions.resetAllStatuses}
        </button>
        <button onClick={handleExport} className="action-btn btn-accent">
          {t.quickActions.exportData}
        </button>
        <button onClick={pickRandomTechnology} className="action-btn btn-special">
          {t.quickActions.randomPick}
        </button>
      </div>
      
      <div className="quick-stats">
        <div className="stat-item">
          <span className="stat-label">{t.quickActions.completed}</span>
          <span className="stat-value stat-completed">{completedCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t.quickActions.inProgress}</span>
          <span className="stat-value stat-in-progress">{inProgressCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t.quickActions.notStarted}</span>
          <span className="stat-value stat-not-started">{notStartedCount}</span>
        </div>
      </div>

      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title={t.modal.exportData}
        size="small"
      >
        <div className="export-modal-content">
          <p>{t.quickActions.exportSuccess}</p>
          <p>{t.quickActions.exportDescription}</p>
          <p>{t.quickActions.exportedCount}: <strong>{technologies.length}</strong> {language === 'ru' ? 'технологий' : 'technologies'}</p>
          <button 
            className="modal-close-btn"
            onClick={() => setShowExportModal(false)}
          >
            {t.quickActions.close}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default QuickActions;
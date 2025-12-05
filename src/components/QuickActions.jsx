// src/components/QuickActions.jsx
import './QuickActions.css';
import { useState } from 'react';
import Modal from './Modal';

function QuickActions({ 
  technologies, 
  onMarkAllCompleted, 
  onResetAll,
  onToggleStatus
}) {
  const [showExportModal, setShowExportModal] = useState(false);
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
      alert('Все технологии уже начаты или завершены!');
      return;
    }

    const randomTech = notStartedTechs[Math.floor(Math.random() * notStartedTechs.length)];
    
    if (onToggleStatus) {
      onToggleStatus(randomTech.id);
      alert(`Выбрана технология: "${randomTech.title}"! Статус изменён на "В процессе".`);
    }
  };

  return (
    <div className="quick-actions">
      <h3>Быстрые действия</h3>
      
      <div className="actions-buttons">
        <button onClick={onMarkAllCompleted} className="action-btn btn-primary">
          Отметить все как выполненные
        </button>
        <button onClick={onResetAll} className="action-btn btn-secondary">
          Сбросить все статусы
        </button>
        <button onClick={handleExport} className="action-btn btn-accent">
          Экспорт данных
        </button>
        <button onClick={pickRandomTechnology} className="action-btn btn-special">
          Случайный выбор
        </button>
      </div>
      
      <div className="quick-stats">
        <div className="stat-item">
          <span className="stat-label">Выполнено</span>
          <span className="stat-value stat-completed">{completedCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">В процессе</span>
          <span className="stat-value stat-in-progress">{inProgressCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Не начато</span>
          <span className="stat-value stat-not-started">{notStartedCount}</span>
        </div>
      </div>

      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Экспорт данных"
        size="small"
      >
        <div className="export-modal-content">
          <p>Данные успешно экспортированы!</p>
          <p>Файл автоматически скачался в формате JSON.</p>
          <p>Всего экспортировано: <strong>{technologies.length}</strong> технологий</p>
          <button 
            className="modal-close-btn"
            onClick={() => setShowExportModal(false)}
          >
            Закрыть
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default QuickActions;
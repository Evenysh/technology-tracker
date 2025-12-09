// src/components/BulkStatusEditor.jsx
import { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../i18n/translations';
import './BulkStatusEditor.css';

function BulkStatusEditor({ technologies, onSave, onCancel }) {
  const { language } = useLanguage();
  const t = translations[language]?.bulkStatusEditor || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [newStatus, setNewStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Фильтрация списка технологий ---
  const filteredTechnologies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return technologies.filter((tech) => {
      if (filterStatus !== 'all' && tech.status !== filterStatus) return false;

      if (!query) return true;

      const title = tech.title?.toLowerCase() || '';
      const desc = tech.description?.toLowerCase() || '';
      const cat = tech.category?.toLowerCase() || '';

      return (
        title.includes(query) ||
        desc.includes(query) ||
        cat.includes(query)
      );
    });
  }, [technologies, searchQuery, filterStatus]);

  const allFilteredSelected =
    filteredTechnologies.length > 0 &&
    filteredTechnologies.every((tech) => selectedIds.has(tech.id));

  // --- Переключить выбор одной технологии ---
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // --- Выделить / снять всё в текущем фильтре ---
  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      if (allFilteredSelected) {
        const next = new Set(prev);
        filteredTechnologies.forEach((tech) => next.delete(tech.id));
        return next;
      } else {
        const next = new Set(prev);
        filteredTechnologies.forEach((tech) => next.add(tech.id));
        return next;
      }
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  // --- Применить изменения ---
  const handleApply = async () => {
    if (selectedIds.size === 0) {
      alert(
        t.selectAtLeastOne ||
          (language === 'ru'
            ? 'Выберите хотя бы одну технологию.'
            : 'Select at least one technology.')
      );
      return;
    }

    if (!newStatus) {
      alert(
        t.selectStatusFirst ||
          (language === 'ru'
            ? 'Выберите новый статус для выбранных технологий.'
            : 'Select new status for selected technologies.')
      );
      return;
    }

    const changes = Array.from(selectedIds).map((id) => ({
      id,
      status: newStatus,
    }));

    try {
      setIsSubmitting(true);
      await onSave(changes);
      // после успешного сохранения очистим выбор и статус
      setSelectedIds(new Set());
      setNewStatus('');
    } catch (e) {
      console.error(e);
      alert(
        t.bulkUpdateError ||
          (language === 'ru'
            ? 'Ошибка при обновлении статусов.'
            : 'Error updating statuses.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusText = (status) => {
    if (language === 'ru') {
      switch (status) {
        case 'not-started':
          return 'Не начато';
        case 'in-progress':
          return 'В процессе';
        case 'completed':
          return 'Завершено';
        default:
          return status;
      }
    } else {
      switch (status) {
        case 'not-started':
          return 'Not started';
        case 'in-progress':
          return 'In progress';
        case 'completed':
          return 'Completed';
        default:
          return status;
      }
    }
  };

  const getPriorityText = (priority) => {
    if (!priority) return '';
    if (language === 'ru') {
      switch (priority) {
        case 'critical':
          return 'Критический';
        case 'high':
          return 'Высокий';
        case 'medium':
          return 'Средний';
        case 'low':
          return 'Низкий';
        default:
          return priority;
      }
    } else {
      switch (priority) {
        case 'critical':
          return 'Critical';
        case 'high':
          return 'High';
        case 'medium':
          return 'Medium';
        case 'low':
          return 'Low';
        default:
          return priority;
      }
    }
  };

  return (
    <div
      className="bulk-editor"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-editor-title"
    >
      <div className="bulk-editor-header">
        <div>
          <h2 id="bulk-editor-title">
            {t.title ||
              (language === 'ru'
                ? 'Массовое редактирование статусов'
                : 'Bulk status editing')}
          </h2>
          <p className="bulk-editor-subtitle">
            {language === 'ru'
              ? 'Выберите технологии слева, затем задайте новый статус.'
              : 'Select technologies on the left, then choose a new status.'}
          </p>
        </div>

        <button
          type="button"
          className="bulk-editor-close"
          onClick={onCancel}
          disabled={isSubmitting}
          aria-label={t.cancel || (language === 'ru' ? 'Отмена' : 'Cancel')}
        >
          ×
        </button>
      </div>

      {/* Верхние контролы: поиск + фильтр + новый статус */}
      <div className="bulk-editor-controls">
        <div className="control-block">
          <label htmlFor="bulk-search" className="control-label">
            {t.searchPlaceholder ||
              (language === 'ru'
                ? 'Поиск технологий...'
                : 'Search technologies...')}
          </label>
          <input
            id="bulk-search"
            type="text"
            className="control-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              t.searchPlaceholder ||
              (language === 'ru'
                ? 'Поиск по названию, описанию, категории'
                : 'Search by title, description, category')
            }
            disabled={isSubmitting}
          />
        </div>

        <div className="control-block">
          <label htmlFor="bulk-status-filter" className="control-label">
            {t.statusFilter ||
              (language === 'ru' ? 'Фильтр по статусу' : 'Status filter')}
          </label>
          <select
            id="bulk-status-filter"
            className="control-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            disabled={isSubmitting}
          >
            {/* «Все статусы» — плейсхолдер, его нельзя выбрать вручную */}
            <option value="all" disabled>
              {t.allStatuses ||
                (language === 'ru' ? 'Все статусы' : 'All statuses')}
            </option>
            <option value="not-started">
              {t.notStarted || getStatusText('not-started')}
            </option>
            <option value="in-progress">
              {t.inProgress || getStatusText('in-progress')}
            </option>
            <option value="completed">
              {t.completed || getStatusText('completed')}
            </option>
          </select>
        </div>

        <div className="control-block">
          <label htmlFor="bulk-new-status" className="control-label required">
            {t.newStatusLabel ||
              (language === 'ru' ? 'Новый статус для выбранных' : 'New status')}
          </label>
          <select
            id="bulk-new-status"
            className="control-select"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            disabled={isSubmitting || selectedIds.size === 0}
          >
            <option value="">
              {t.selectStatus ||
                (language === 'ru' ? 'Выберите статус...' : 'Select status...')}
            </option>
            <option value="not-started">
              {t.notStarted || getStatusText('not-started')}
            </option>
            <option value="in-progress">
              {t.inProgress || getStatusText('in-progress')}
            </option>
            <option value="completed">
              {t.completed || getStatusText('completed')}
            </option>
          </select>
        </div>
      </div>

      {/* Информация по количеству */}
      <div className="bulk-editor-summary">
        <span>
          {(t.totalTechnologies ||
            (language === 'ru' ? 'Всего' : 'Total')) + ':'}{' '}
          <strong>{technologies.length}</strong>
        </span>
        <span>
          {(t.filteredCount ||
            (language === 'ru' ? 'Отфильтровано' : 'Filtered')) + ':'}{' '}
          <strong>{filteredTechnologies.length}</strong>
        </span>
        <span>
          {(t.selectedCount ||
            (language === 'ru' ? 'Выбрано' : 'Selected')) + ':'}{' '}
          <strong>{selectedIds.size}</strong>
        </span>
      </div>

      {/* Основной контент: список технологий */}
      <div className="bulk-editor-body">
        <div className="bulk-tech-list-header">
          <div className="bulk-tech-list-header-left">
            <button
              type="button"
              className="link-button"
              onClick={toggleSelectAll}
              disabled={filteredTechnologies.length === 0 || isSubmitting}
            >
              {allFilteredSelected
                ? language === 'ru'
                  ? 'Снять выделение'
                  : 'Deselect all'
                : language === 'ru'
                ? 'Выделить всё в списке'
                : 'Select all in list'}
            </button>

            <button
              type="button"
              className="link-button"
              onClick={clearSelection}
              disabled={selectedIds.size === 0 || isSubmitting}
            >
              {language === 'ru' ? 'Очистить выбор' : 'Clear selection'}
            </button>
          </div>
        </div>

        <div className="bulk-tech-list">
          {filteredTechnologies.length === 0 ? (
            <div className="bulk-empty">
              <div className="bulk-empty-icon">📚</div>
              <h4>
                {searchQuery || filterStatus !== 'all'
                  ? t.noTechnologiesFound ||
                    (language === 'ru'
                      ? 'Технологии не найдены'
                      : 'No technologies found')
                  : t.noTechnologies ||
                    (language === 'ru'
                      ? 'Нет доступных технологий'
                      : 'No technologies')}
              </h4>
              <p>
                {t.changeSearchOrFilter ||
                  (language === 'ru'
                    ? 'Попробуйте изменить условия поиска или фильтра'
                    : 'Try changing search or filter parameters')}
              </p>
            </div>
          ) : (
            <div className="bulk-tech-grid">
              {filteredTechnologies.map((tech) => {
                const selected = selectedIds.has(tech.id);
                return (
                  <div
                    key={tech.id}
                    className={
                      'bulk-tech-card' +
                      (selected ? ' bulk-tech-card-selected' : '')
                    }
                    onClick={() => toggleSelect(tech.id)}
                  >
                    <div className="bulk-tech-card-top">
                      <label className="bulk-checkbox-wrapper">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleSelect(tech.id)}
                          onClick={(e) => e.stopPropagation()}
                          disabled={isSubmitting}
                        />
                        <span className="bulk-checkbox-custom" />
                      </label>
                      <div className="bulk-tech-main">
                        <div className="bulk-tech-title">{tech.title}</div>
                        {tech.category && (
                          <div className="bulk-tech-category">
                            {tech.category}
                          </div>
                        )}
                      </div>
                      <span
                        className={
                          'bulk-status-pill status-' + (tech.status || 'default')
                        }
                      >
                        {getStatusText(tech.status)}
                      </span>
                    </div>

                    {tech.description && (
                      <div className="bulk-tech-desc">{tech.description}</div>
                    )}

                    <div className="bulk-tech-footer">
                      <div className="bulk-tech-meta">
                        {tech.priority && (
                          <span
                            className={
                              'bulk-priority priority-' + tech.priority
                            }
                          >
                            {getPriorityText(tech.priority)}
                          </span>
                        )}
                        {tech.estimatedHours > 0 && (
                          <span className="bulk-hours">
                            ⏱ {tech.estimatedHours}
                            {language === 'ru' ? ' ч' : ' h'}
                          </span>
                        )}
                      </div>
                      <span className="bulk-tech-id">ID: {tech.id}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="bulk-editor-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={handleApply}
          disabled={isSubmitting || selectedIds.size === 0 || !newStatus}
        >
          {isSubmitting
            ? language === 'ru'
              ? 'Применяем...'
              : 'Applying...'
            : (t.applyChanges ||
                (language === 'ru' ? 'Применить изменения' : 'Apply changes')) +
              (selectedIds.size > 0 ? ` (${selectedIds.size})` : '')}
        </button>

        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t.cancel || (language === 'ru' ? 'Отмена' : 'Cancel')}
        </button>
      </div>
    </div>
  );
}

export default BulkStatusEditor;

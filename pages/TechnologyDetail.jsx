// src/pages/TechnologyDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import './TechnologyDetail.css';

function TechnologyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [technology, setTechnology] = useState(null);
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      const tech = technologies.find(t => t.id === parseInt(id));
      if (tech) {
        setTechnology(tech);
        setNotes(tech.notes || '');
      }
    }
  }, [id]);

  const updateTechnology = (updates) => {
    const saved = localStorage.getItem('technologies');
    if (!saved) return;

    const technologies = JSON.parse(saved);
    const updated = technologies.map(tech => 
      tech.id === parseInt(id) ? { ...tech, ...updates } : tech
    );
    
    localStorage.setItem('technologies', JSON.stringify(updated));
    setTechnology(prev => ({ ...prev, ...updates }));
  };

  const handleStatusChange = (newStatus) => {
    updateTechnology({ status: newStatus });
  };

  const handleSaveNotes = () => {
    updateTechnology({ notes });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Удалить эту технологию?')) {
      const saved = localStorage.getItem('technologies');
      if (saved) {
        const technologies = JSON.parse(saved);
        const updated = technologies.filter(t => t.id !== parseInt(id));
        localStorage.setItem('technologies', JSON.stringify(updated));
        navigate('/technologies');
      }
    }
  };

  if (!technology) {
    return (
      <div className="page">
        <div className="not-found">
          <h1>🚫 Технология не найдена</h1>
          <p>Технология с ID {id} не существует.</p>
          <Link to="/technologies" className="btn btn-primary">
            ← Вернуться к списку
          </Link>
        </div>
      </div>
    );
  }

  // Прогресс для этой технологии
  const techProgress = technology.status === 'completed' ? 100 : 
                      technology.status === 'in-progress' ? 50 : 0;

  return (
    <div className="technology-detail-page">
      <div className="page-header">
        <Link to="/technologies" className="back-link">
          ← Назад к списку
        </Link>
        <div className="header-actions">
          <button onClick={handleDelete} className="btn btn-danger">
            🗑️ Удалить
          </button>
        </div>
      </div>

      {/* Основная информация */}
      <div className="tech-main-info">
        <div className="tech-title-section">
          <h1>{technology.title}</h1>
          <span className={`status-badge status-${technology.status}`}>
            {technology.status === 'completed' ? 'Изучено' : 
             technology.status === 'in-progress' ? 'В процессе' : 'Не начато'}
          </span>
        </div>
        
        <div className="tech-category">
          <span className="category-tag">{technology.category || 'frontend'}</span>
        </div>

        <div className="tech-description">
          <h3>📝 Описание</h3>
          <p>{technology.description}</p>
        </div>
      </div>

      {/* Прогресс */}
      <div className="tech-progress-section">
        <h3>Прогресс изучения</h3>
        <ProgressBar 
          progress={techProgress}
          height={20}
          color="#6a0dad"
          showPercentage={true}
        />
        
        <div className="status-buttons">
          <button
            onClick={() => handleStatusChange('not-started')}
            className={`status-btn ${technology.status === 'not-started' ? 'active' : ''}`}
          >
            Не начато
          </button>
          <button
            onClick={() => handleStatusChange('in-progress')}
            className={`status-btn ${technology.status === 'in-progress' ? 'active' : ''}`}
          >
            В процессе
          </button>
          <button
            onClick={() => handleStatusChange('completed')}
            className={`status-btn ${technology.status === 'completed' ? 'active' : ''}`}
          >
            Завершено
          </button>
        </div>
      </div>

      {/* Заметки */}
      <div className="tech-notes-section">
        <div className="notes-header">
          <h3>📌 Мои заметки</h3>
          {isEditing ? (
            <div className="notes-actions">
              <button onClick={handleSaveNotes} className="btn btn-primary btn-small">
                💾 Сохранить
              </button>
              <button onClick={() => setIsEditing(false)} className="btn btn-secondary btn-small">
                ❌ Отмена
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="btn btn-outline btn-small">
              ✏️ Редактировать
            </button>
          )}
        </div>
        
        {isEditing ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="notes-textarea"
            placeholder="Добавьте заметки по изучению этой технологии..."
            rows={6}
          />
        ) : (
          <div className="notes-content">
            {notes ? (
              <p>{notes}</p>
            ) : (
              <p className="notes-empty">Заметок пока нет. Нажмите "Редактировать", чтобы добавить.</p>
            )}
          </div>
        )}
      </div>

      {/* Дополнительная информация */}
      <div className="tech-meta-section">
        <h3>ℹ️ Дополнительно</h3>
        <div className="meta-grid">
          <div className="meta-item">
            <span className="meta-label">Дата добавления:</span>
            <span className="meta-value">
              {new Date(technology.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">ID:</span>
            <span className="meta-value">{technology.id}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Последнее изменение:</span>
            <span className="meta-value">
              {new Date(technology.updatedAt || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechnologyDetail;
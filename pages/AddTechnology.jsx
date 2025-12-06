// src/pages/AddTechnology.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AddTechnology.css';

function AddTechnology() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'frontend',
    status: 'not-started',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Название обязательно';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Минимум 3 символа';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Минимум 10 символов';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Получаем текущие технологии
    const saved = localStorage.getItem('technologies');
    const technologies = saved ? JSON.parse(saved) : [];
    
    // Создаем новую технологию
    const newTech = {
      id: Date.now(), // Простой ID на основе времени
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Добавляем и сохраняем
    const updated = [...technologies, newTech];
    localStorage.setItem('technologies', JSON.stringify(updated));
    
    // Показываем уведомление и переходим
    alert(`Технология "${formData.title}" добавлена!`);
    navigate('/technologies');
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      category: 'frontend',
      status: 'not-started',
      notes: ''
    });
    setErrors({});
  };

  return (
    <div className="add-technology-page">
      <div className="page-header">
        <Link to="/technologies" className="back-link">
          ← Назад к списку
        </Link>
        <h1>➕ Добавить новую технологию</h1>
      </div>

      <form onSubmit={handleSubmit} className="technology-form">
        {/* Название */}
        <div className="form-group">
          <label htmlFor="title">
            Название технологии *
            {errors.title && <span className="error-message"> — {errors.title}</span>}
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Например: React Hooks, Node.js API..."
            className={errors.title ? 'error' : ''}
          />
        </div>

        {/* Категория и статус */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Категория</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="database">Базы данных</option>
              <option value="devops">DevOps</option>
              <option value="mobile">Мобильная разработка</option>
              <option value="other">Другое</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Начальный статус</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="not-started">Не начато</option>
              <option value="in-progress">В процессе</option>
              <option value="completed">Завершено</option>
            </select>
          </div>
        </div>

        {/* Описание */}
        <div className="form-group">
          <label htmlFor="description">
            Описание *
            {errors.description && <span className="error-message"> — {errors.description}</span>}
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Опишите, что нужно изучить, какие концепции важны..."
            rows={4}
            className={errors.description ? 'error' : ''}
          />
        </div>

        {/* Заметки */}
        <div className="form-group">
          <label htmlFor="notes">Заметки (необязательно)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Дополнительные заметки, ссылки на ресурсы..."
            rows={3}
          />
        </div>

        {/* Кнопки */}
        <div className="form-actions">
          <button type="button" onClick={handleReset} className="btn btn-secondary">
            Очистить форму
          </button>
          <button type="submit" className="btn btn-primary">
            💾 Сохранить технологию
          </button>
        </div>
      </form>

      {/* Подсказка */}
      <div className="form-hint">
        <h3>💡 Советы по заполнению:</h3>
        <ul>
          <li>Давайте конкретные названия (например, "React Context API" вместо просто "React")</li>
          <li>В описании укажите ключевые темы для изучения</li>
          <li>Используйте заметки для ссылок на документацию или курсы</li>
          <li>Вы можете изменить статус позже на странице деталей</li>
        </ul>
      </div>
    </div>
  );
}

export default AddTechnology;
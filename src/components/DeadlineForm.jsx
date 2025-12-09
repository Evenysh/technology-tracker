import { useState, useEffect, useCallback } from 'react';
import './DeadlineForm.css';

function DeadlineForm({ technology, initialData = {}, onSave, onCancel }) {
  const [formData, setFormData] = useState(() => {
    const hours = initialData.estimatedHours;
    return {
      startDate: initialData.startDate || '',
      deadline: initialData.deadline || '',
      estimatedHours: hours !== undefined && hours !== null && hours !== '' ? hours.toString() : '',
      priority: initialData.priority || '', // Чтобы placeholder работал корректно
      notes: initialData.notes || ''
    };
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (formData.startDate) {
      const startDate = new Date(formData.startDate);
      if (startDate < today) {
        newErrors.startDate = 'Дата начала не может быть в прошлом';
      }
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Дедлайн обязателен';
    } else {
      const deadlineDate = new Date(formData.deadline);
      
      if (deadlineDate < today) {
        newErrors.deadline = 'Дедлайн не может быть в прошлом';
      }
      
      if (formData.startDate) {
        const startDate = new Date(formData.startDate);
        if (deadlineDate < startDate) {
          newErrors.deadline = 'Дедлайн должен быть после даты начала';
        }
      }
    }

    if (formData.estimatedHours !== '' && formData.estimatedHours !== undefined) {
      const hoursValue = Number(formData.estimatedHours);
      
      if (formData.estimatedHours.trim() === '' || hoursValue === 0) {
        // 0 или пустое — допускаем
      } else if (isNaN(hoursValue) || hoursValue <= 0) {
        newErrors.estimatedHours = 'Введите корректное количество часов (больше 0)';
      } else if (hoursValue > 1000) {
        newErrors.estimatedHours = 'Слишком большое количество часов (максимум 1000)';
      } else if (!/^\d+$/.test(formData.estimatedHours.trim())) {
        newErrors.estimatedHours = 'Введите целое число часов';
      }
    }

    if (!formData.priority) {
      newErrors.priority = 'Выберите приоритет';
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [formData]);

  useEffect(() => {
    validateForm();
  }, [formData, validateForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid || isSubmitting) {
      console.log('❌ Форма невалидна или отправляется');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let estimatedHoursValue = 0;
      if (formData.estimatedHours !== '' && formData.estimatedHours !== undefined) {
        estimatedHoursValue = parseInt(formData.estimatedHours, 10);
        if (isNaN(estimatedHoursValue)) {
          estimatedHoursValue = 0;
        }
      }
      
      const dataToSend = {
        startDate: formData.startDate,
        deadline: formData.deadline,
        estimatedHours: estimatedHoursValue,
        priority: formData.priority,
        notes: formData.notes
      };

      onSave(dataToSend);
      
    } catch (error) {
      console.error('❌ Ошибка сохранения:', error);
      alert('Ошибка сохранения данных');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel, isSubmitting]);

  useEffect(() => {
    const firstInput = document.getElementById('startDate');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }, []);

  return (
    <div className="deadline-form-container">
      <form 
        onSubmit={handleSubmit} 
        className="deadline-form"
        noValidate
        aria-labelledby="deadline-form-title"
      >
        <h2 id="deadline-form-title">
          {technology ? 'Настройка сроков изучения' : 'Установить сроки изучения'}
        </h2>

        {technology && (
          <div className="technology-info">
            <h3>{technology.title}</h3>
            <p>{technology.description}</p>
          </div>
        )}

        {/* START DATE */}
        <div className="form-group">
          <label htmlFor="startDate" className="required">
            Дата начала изучения *
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.startDate}
            aria-describedby={errors.startDate ? 'startDate-error' : undefined}
            className={`form-control ${errors.startDate ? 'error' : ''}`}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.startDate && (
            <span 
              id="startDate-error" 
              className="error-message" 
              role="alert"
            >
              {errors.startDate}
            </span>
          )}
        </div>

        {/* DEADLINE */}
        <div className="form-group">
          <label htmlFor="deadline" className="required">
            Дедлайн изучения *
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.deadline}
            aria-describedby={errors.deadline ? 'deadline-error' : undefined}
            className={`form-control ${errors.deadline ? 'error' : ''}`}
            min={formData.startDate || new Date().toISOString().split('T')[0]}
          />
          {errors.deadline && (
            <span 
              id="deadline-error" 
              className="error-message" 
              role="alert"
            >
              {errors.deadline}
            </span>
          )}
        </div>

        {/* HOURS */}
        <div className="form-group">
          <label htmlFor="estimatedHours">
            Оценка часов на изучение
          </label>
          <input
            id="estimatedHours"
            name="estimatedHours"
            type="number"
            step="1"
            min="1"
            max="1000"
            value={formData.estimatedHours}
            onChange={handleChange}
            aria-invalid={!!errors.estimatedHours}
            aria-describedby={errors.estimatedHours ? 'hours-error' : undefined}
            className={`form-control ${errors.estimatedHours ? 'error' : ''}`}
            placeholder="Например: 70"
            onBlur={(e) => {
              const value = e.target.value;
              if (value && !isNaN(value)) {
                const intValue = Math.round(Number(value));
                if (intValue !== Number(value)) {
                  e.target.value = intValue;
                  handleChange({ target: { name: 'estimatedHours', value: intValue.toString() } });
                }
              }
            }}
          />
          {errors.estimatedHours && (
            <span 
              id="hours-error" 
              className="error-message" 
              role="alert"
            >
              {errors.estimatedHours}
            </span>
          )}
          <div className="form-hint">
            Введите целое количество часов (от 1 до 1000)
          </div>
        </div>

        {/* PRIORITY */}
        <div className="form-group">
          <label htmlFor="priority" className="required">
            Приоритет изучения *
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.priority}
            aria-describedby={errors.priority ? 'priority-error' : undefined}
            className={`form-control ${errors.priority ? 'error' : ''}`}
          >
            {/* Невыбираемый placeholder */}
            <option value="" disabled hidden>
              Выберите приоритет
            </option>
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
            <option value="critical">Критический</option>
          </select>
          {errors.priority && (
            <span 
              id="priority-error" 
              className="error-message" 
              role="alert"
            >
              {errors.priority}
            </span>
          )}
        </div>

        {/* NOTES */}
        <div className="form-group">
          <label htmlFor="notes">
            Дополнительные заметки
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="form-control"
            placeholder="Дополнительные комментарии по изучению..."
          />
        </div>

        {/* ACTIONS */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isFormValid || isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner" aria-hidden="true"></span>
                <span className="btn-text">Сохранение...</span>
              </>
            ) : (
              <span className="btn-text">Сохранить сроки</span>
            )}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

export default DeadlineForm;

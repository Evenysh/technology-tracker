// pages/Home.jsx
import React from 'react';
import '../src/App.css'; // путь к стилям

function Home() {
  return (
    <div className="page home-page">
      <h1>🚀 Трекер изучения технологий</h1>
      <p className="subtitle">Система для отслеживания прогресса в программировании</p>
      
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📚</div>
          <h3>Управление технологиями</h3>
          <p>Добавляйте, редактируйте и отслеживайте технологии для изучения</p>
          <a href="/technology-list" className="feature-link">Перейти к списку →</a>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Статистика прогресса</h3>
          <p>Анализируйте свой прогресс с помощью графиков и отчетов</p>
          <a href="/stats" className="feature-link">Смотреть статистику →</a>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">⚙️</div>
          <h3>Настройки</h3>
          <p>Настройте приложение под свои потребности</p>
          <a href="/settings" className="feature-link">Перейти к настройкам →</a>
        </div>
      </div>
      
      <div className="quick-start">
        <h2>Быстрый старт</h2>
        <p>Начните с добавления первой технологии для изучения</p>
        <div className="quick-actions">
          <a href="/add-technology" className="btn btn-primary">
            ➕ Добавить технологию
          </a>
          <a href="/technology-list" className="btn btn-secondary">
            👁️ Просмотреть все
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
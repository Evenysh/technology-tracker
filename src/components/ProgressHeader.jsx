// src/components/ProgressHeader.jsx
import './ProgressHeader.css';
import ProgressBar from './ProgressBar';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../i18n/translations';

function ProgressHeader({ technologies }) {
  const { language } = useLanguage();
  const t = translations[language];
  
  // Подсчёт статистики
  const total = technologies.length;
  const completed = technologies.filter(tech => tech.status === 'completed').length;
  const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="progress-header">
      <h2>{t.progressHeader.title}</h2>
      
      <div className="stats">
        <div className="stat">
          <span className="stat-label">{t.progressHeader.totalTechnologies}:</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="stat">
          <span className="stat-label">{t.progressHeader.studied}:</span>
          <span className="stat-value">{completed}</span>
        </div>
        <div className="stat">
          <span className="stat-label">{t.progressHeader.inProgress}:</span>
          <span className="stat-value">{inProgress}</span>
        </div>
      </div>

      {/* Используем переиспользуемый ProgressBar */}
      <ProgressBar
        progress={percentage}
        label={t.progressHeader.overallProgress}
        color="#8a2be2"
        height={20}
        animated={true}
        showPercentage={true}
        className="main-progress-bar"
      />

      <div className="progress-text">
        {completed} {t.progressHeader.studiedOutOf} {total} {t.progressHeader.technologies}
      </div>
    </div>
  );
}

export default ProgressHeader;
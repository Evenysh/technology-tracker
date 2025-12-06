// pages/Stats.jsx
import { useLanguage } from '../src/contexts/LanguageContext';
import { translations } from '../src/i18n/translations';
import { useTechnologies } from '../src/contexts/TechnologiesContext';
import './Stats.css';

function Stats() {
  const { technologies, progress } = useTechnologies();
  const { language } = useLanguage();
  const t = translations[language];

  // Рассчитываем статистику из реальных данных
  const completed = technologies.filter(t => t.status === 'completed').length;
  const inProgress = technologies.filter(t => t.status === 'in-progress').length;
  const notStarted = technologies.filter(t => t.status === 'not-started').length;
  const total = technologies.length;

  // Рассчитываем проценты для диаграммы
  const completedPercent = total > 0 ? (completed / total) * 100 : 0;
  const inProgressPercent = total > 0 ? (inProgress / total) * 100 : 0;
  const notStartedPercent = total > 0 ? (notStarted / total) * 100 : 0;

  // Определяем уровень прогресса
  const getProgressLevel = () => {
    if (progress < 30) return t.stats.beginner;
    if (progress < 70) return t.stats.intermediate;
    return t.stats.expert;
  };

  return (
    <div className="stats-page">
      <div className="stats-header">
        <h1>{t.stats.title}</h1>
        <p className="stats-subtitle">{t.stats.subtitle}</p>
      </div>
      
      {/* Карточки с общей статистикой */}
      <div className="stats-overview">
        <div className="stat-card total-card">
          <h3 className="stat-title">{t.stats.totalTechnologies}</h3>
          <div className="stat-number total-number">{total}</div>
          <p className="stat-description">{t.stats.inYourTracker}</p>
        </div>
        
        <div className="stat-card completed-card">
          <h3 className="stat-title">{t.stats.studied}</h3>
          <div className="stat-number completed-number">{completed}</div>
          <p className="stat-description">{completedPercent.toFixed(1)}% {t.stats.percentOfTotal}</p>
        </div>
        
        <div className="stat-card inprogress-card">
          <h3 className="stat-title">{t.stats.inProgress}</h3>
          <div className="stat-number inprogress-number">{inProgress}</div>
          <p className="stat-description">{t.stats.activelyStudied}</p>
        </div>
        
        <div className="stat-card notstarted-card">
          <h3 className="stat-title">{t.stats.notStarted}</h3>
          <div className="stat-number notstarted-number">{notStarted}</div>
          <p className="stat-description">{t.stats.waiting}</p>
        </div>
      </div>

      {/* График общего прогресса */}
      <div className="stats-section">
        <h2 className="section-title">{t.stats.overallProgress}</h2>
        <div className="progress-chart">
          <div className="progress-bar-wrapper">
            <div 
              className="progress-bar-fill"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              <span className="progress-text">{progress}%</span>
            </div>
          </div>
          <p className="progress-description">
            {completed} {t.stats.studiedOutOf} {total} {t.stats.technologies}
          </p>
        </div>
      </div>

      {/* Диаграмма распределения */}
      <div className="stats-section">
        <h2 className="section-title">{t.stats.statusDistribution}</h2>
        <div className="pie-chart-container">
          <div className="pie-chart">
            <div 
              className="pie-chart-circle"
              style={{
                background: `conic-gradient(
                  #4CAF50 0% ${completedPercent}%,
                  #FF9800 ${completedPercent}% ${completedPercent + inProgressPercent}%,
                  #F44336 ${completedPercent + inProgressPercent}% 100%
                )`
              }}
            ></div>
          </div>
          
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color completed-color"></span>
              <div className="legend-info">
                <span className="legend-label">{t.stats.studied}</span>
                <span className="legend-value">
                  {completed} {t.stats.studiedTech} ({completedPercent.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="legend-item">
              <span className="legend-color inprogress-color"></span>
              <div className="legend-info">
                <span className="legend-label">{t.stats.inProgress}</span>
                <span className="legend-value">
                  {inProgress} {t.stats.studiedTech} ({inProgressPercent.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="legend-item">
              <span className="legend-color notstarted-color"></span>
              <div className="legend-info">
                <span className="legend-label">{t.stats.notStarted}</span>
                <span className="legend-value">
                  {notStarted} {t.stats.studiedTech} ({notStartedPercent.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="stats-section">
        <h2 className="section-title">{t.stats.additionalInfo}</h2>
        <div className="additional-stats">
          <div className="additional-stat">
            <div className="additional-stat-label">{t.stats.progressLevel}</div>
            <div className="additional-stat-value">
              {getProgressLevel()}
            </div>
            <div className="additional-stat-hint">
              {t.stats.basedOnPercent}
            </div>
          </div>
          <div className="additional-stat">
            <div className="additional-stat-label">{t.stats.nextGoal}</div>
            <div className="additional-stat-value">
              {notStarted > 0 ? `${t.stats.studied} ${notStarted} ${t.stats.technologies}` : t.stats.greatWork}
            </div>
            <div className="additional-stat-hint">
              {notStarted > 0 ? `${notStarted} ${t.stats.technologiesAwait}` : t.stats.greatWork}
            </div>
          </div>
          <div className="additional-stat">
            <div className="additional-stat-label">{t.stats.activeTechnologies}</div>
            <div className="additional-stat-value">
              {inProgress > 0 ? `${inProgress} ${t.stats.inWork}` : t.stats.noActive}
            </div>
            <div className="additional-stat-hint">
              {inProgress > 0 ? t.stats.keepGoing : t.stats.addTechnologies}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
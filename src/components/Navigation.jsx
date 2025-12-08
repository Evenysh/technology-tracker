// src/components/Navigation.jsx
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../i18n/translations';
import './Navigation.css';

function Navigation() {
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language];
  
  // Обновленный список навигационных элементов
  const navItems = [
    { path: '/', label: t.navigation.home, exact: true, icon: '🏠' },
    { path: '/stats', label: t.navigation.stats, icon: '📊' },
    { path: '/api-search', label: t.navigation.apiSearch || 'API Поиск', icon: '🔍' }, // Новая ссылка
    { path: '/settings', label: t.navigation.settings, icon: '⚙️' },
  ];

  return (
    <nav className="navigation">
      <div className="nav-logo">
        <h2>
          <span role="img" aria-label="rocket" style={{ marginRight: '10px' }}></span>
          {t.navigation.appName || 'Трекер технологий'}
        </h2>
      </div>
      
      <div className="nav-links">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${
              (item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path))
                ? 'active'
                : ''
            }`}
            title={item.label}
          >
            {item.icon && <span className="nav-icon">{item.icon}</span>}
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navigation;
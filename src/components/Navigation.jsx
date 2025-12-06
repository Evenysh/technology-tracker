// src/components/Navigation.jsx
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../i18n/translations';
import './Navigation.css';

function Navigation() {
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language];
  
  const navItems = [
    { path: '/', label: t.navigation.home, exact: true },
    { path: '/stats', label: t.navigation.stats },
    { path: '/settings', label: t.navigation.settings },
  ];

  return (
    <nav className="navigation">
      <div className="nav-logo">
        <h2>{t.navigation.appName}</h2>
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
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navigation;
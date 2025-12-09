// src/components/ApiSearch.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTechnologies } from '../contexts/TechnologiesContext';
import { translations } from '../i18n/translations';
import './ApiSearch.css';

function ApiSearch() {
  const { language } = useLanguage();
  const { addTechnology, technologyExists } = useTechnologies();
  const t = translations[language].apiSearch;

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [addedTechnologies, setAddedTechnologies] = useState(new Set());
  const [initialLoad, setInitialLoad] = useState(true);

  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  const categories = [
    { id: 'all', name: t.categories.all },
    { id: 'frontend', name: t.categories.frontend },
    { id: 'backend', name: t.categories.backend },
    { id: 'database', name: t.categories.database },
    { id: 'tool', name: t.categories.tool },
    { id: 'language', name: t.categories.language }
  ];

  // 🔥 Мок-данные
  const getMockTechnologies = useCallback(() => {
    return [
      { id: 1, name: 'React', description: language === 'ru' ? 'Библиотека для создания пользовательских интерфейсов' : 'A library for building user interfaces', category: 'frontend', popularity: 'high', website: 'https://react.dev' },
      { id: 2, name: 'Node.js', description: language === 'ru' ? 'Среда выполнения JavaScript на сервере' : 'JavaScript runtime built on Chrome\'s V8 engine', category: 'backend', popularity: 'high', website: 'https://nodejs.org' },
      { id: 3, name: 'TypeScript', description: language === 'ru' ? 'Типизированное надмножество JavaScript' : 'Typed superset of JavaScript', category: 'language', popularity: 'high', website: 'https://typescriptlang.org' },
      { id: 4, name: 'MongoDB', description: language === 'ru' ? 'Документо-ориентированная NoSQL база данных' : 'Document-oriented NoSQL DB', category: 'database', popularity: 'medium', website: 'https://mongodb.com' },
      { id: 5, name: 'Docker', description: language === 'ru' ? 'Платформа для контейнеризации приложений' : 'Container platform', category: 'tool', popularity: 'high', website: 'https://docker.com' },
      { id: 6, name: 'GraphQL', description: language === 'ru' ? 'Язык запросов для API' : 'A query language for APIs', category: 'backend', popularity: 'medium', website: 'https://graphql.org' },
      { id: 7, name: 'Vue.js', description: language === 'ru' ? 'Прогрессивный JavaScript-фреймворк' : 'Progressive JS framework', category: 'frontend', popularity: 'high', website: 'https://vuejs.org' },
      { id: 8, name: 'PostgreSQL', description: language === 'ru' ? 'Реляционная база данных' : 'Relational database', category: 'database', popularity: 'high', website: 'https://postgresql.org' },
      { id: 9, name: 'Next.js', description: language === 'ru' ? 'React-фреймворк для продакшена' : 'React framework for production', category: 'frontend', popularity: 'high', website: 'https://nextjs.org' },
      { id: 10, name: 'Express.js', description: language === 'ru' ? 'Минималистичный веб-фреймворк' : 'Minimalist web framework', category: 'backend', popularity: 'high', website: 'https://expressjs.com' },
      { id: 11, name: 'Python', description: language === 'ru' ? 'Язык программирования общего назначения' : 'General purpose language', category: 'language', popularity: 'high', website: 'https://python.org' },
      { id: 12, name: 'Git', description: language === 'ru' ? 'Система контроля версий' : 'Version control system', category: 'tool', popularity: 'high', website: 'https://git-scm.com' }
    ];
  }, [language]);

  // ✅ Исправлено — фильтрация по категориям работает всегда
  const loadAllTechnologies = useCallback(() => {
    setLoading(true);

    setTimeout(() => {
      let items = getMockTechnologies();

      if (selectedCategory !== 'all') {
        items = items.filter(t => t.category === selectedCategory);
      }

      const processed = items.map(tech => ({
        ...tech,
        isAdded: addedTechnologies.has(tech.name) || technologyExists(tech.name)
      }));

      setResults(processed);
      setLoading(false);
      setInitialLoad(false);
    }, 300);
  }, [getMockTechnologies, selectedCategory, addedTechnologies, technologyExists]);

  // 🔍 Поиск по запросу + фильтр категории
  const searchTechnologies = useCallback(async (query) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      if (!query.trim()) {
        loadAllTechnologies();
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 600));

      let items = getMockTechnologies().filter(t =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase())
      );

      if (selectedCategory !== 'all') {
        items = items.filter(t => t.category === selectedCategory);
      }

      setResults(items.map(t => ({
        ...t,
        isAdded: addedTechnologies.has(t.name) || technologyExists(t.name)
      })));

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError((language === 'ru' ? 'Ошибка поиска: ' : 'Search error: ') + err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, language, addedTechnologies, technologyExists, loadAllTechnologies, getMockTechnologies]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!value.trim()) {
      loadAllTechnologies();
      return;
    }

    searchTimeoutRef.current = setTimeout(() => searchTechnologies(value), 600);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);

    if (searchTerm.trim()) searchTechnologies(searchTerm);
    else loadAllTechnologies();
  };

  useEffect(() => {
    loadAllTechnologies();
  }, [loadAllTechnologies]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const handleAddToTracker = (tech) => {
    if (technologyExists(tech.name)) {
      alert(language === 'ru'
        ? `Технология "${tech.name}" уже добавлена!`
        : `Technology "${tech.name}" already exists!`);
      return;
    }

    addTechnology({ title: tech.name, description: tech.description, category: tech.category });

    setAddedTechnologies(prev => new Set([...prev, tech.name]));
    setResults(prev => prev.map(item =>
      item.name === tech.name ? { ...item, isAdded: true } : item
    ));

    alert(language === 'ru'
      ? `Технология "${tech.name}" добавлена!`
      : `Technology "${tech.name}" added!`);
  };

  const getPopularityText = (p) => {
    const icons = { high: '🔥', medium: '⚡', low: '✨' };
    const texts = {
      high: t.popularity.high,
      medium: t.popularity.medium,
      low: t.popularity.low
    };
    return `${icons[p]} ${texts[p]}`;
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    loadAllTechnologies();
  };

  return (
    <div className="api-search">

      {/* Заголовок */}
      <div className="search-header">
        <h2>{t.title}</h2>
        <p className="subtitle">{t.subtitle}</p>
      </div>

      {/* Поиск + фильтры */}
      <div className="search-controls">
        <div className="search-input-container">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />

          {loading && <span className="loading-indicator">{t.searchLoading}</span>}

          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="clear-search-btn"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-controls">
          <div className="category-filter">
            <span className="filter-label">{t.categoryFilter}</span>

            <div className="category-buttons">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {(searchTerm || selectedCategory !== 'all') && (
            <button className="reset-filters-btn" onClick={handleResetFilters}>
              {language === 'ru' ? 'Сбросить фильтры' : 'Reset filters'}
            </button>
          )}
        </div>
      </div>

      {/* Ошибка */}
      {error && <div className="error-message">⚠️ {error}</div>}

      {/* Результаты */}
      <div className="search-results">
        <div className="results-grid">
          {results.map(tech => (
            <div key={tech.id} className="tech-result-card">

              <div className="tech-header">
                <h4>{tech.name}</h4>
              </div>

              <div className="tech-badges">
                <span className={`popularity-badge ${tech.popularity}`}>
                  {getPopularityText(tech.popularity)}
                </span>

                {tech.isAdded && (
                  <span className="added-badge">
                    {language === 'ru' ? 'Добавлено' : 'Added'}
                  </span>
                )}
              </div>

              <div className="tech-meta">
                <span className="tech-category">
                  {t.techCategory} <strong>{categories.find(c => c.id === tech.category)?.name}</strong>
                </span>
              </div>

              <p className="tech-description">{tech.description}</p>

              <div className="tech-actions">
                <a href={tech.website} target="_blank" rel="noopener noreferrer" className="website-link">
                  {t.officialWebsite}
                </a>

                <button
                  className={`add-btn ${tech.isAdded ? 'disabled' : ''}`}
                  disabled={tech.isAdded}
                  onClick={() => handleAddToTracker(tech)}
                >
                  {tech.isAdded
                    ? (language === 'ru' ? 'Добавлено' : 'Added')
                    : t.addToTracker}
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default ApiSearch;

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
  const [initialLoad, setInitialLoad] = useState(true); // Для отслеживания начальной загрузки

  // Рефы для debounce и отмены запросов
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Категории для фильтрации - используем переводы
  const categories = [
    { id: 'all', name: t.categories.all },
    { id: 'frontend', name: t.categories.frontend },
    { id: 'backend', name: t.categories.backend },
    { id: 'database', name: t.categories.database },
    { id: 'tool', name: t.categories.tool },
    { id: 'language', name: t.categories.language }
  ];

  // Мок-данные технологий с переводами (выносим в отдельную функцию)
  const getMockTechnologies = useCallback(() => {
    return [
      { 
        id: 1, 
        name: 'React', 
        description: language === 'ru' 
          ? 'Библиотека для создания пользовательских интерфейсов' 
          : 'A library for building user interfaces',
        category: 'frontend',
        popularity: 'high',
        website: 'https://react.dev'
      },
      { 
        id: 2, 
        name: 'Node.js', 
        description: language === 'ru'
          ? 'Среда выполнения JavaScript на сервере'
          : 'JavaScript runtime built on Chrome\'s V8 JavaScript engine',
        category: 'backend',
        popularity: 'high',
        website: 'https://nodejs.org'
      },
      { 
        id: 3, 
        name: 'TypeScript', 
        description: language === 'ru'
          ? 'Типизированное надмножество JavaScript'
          : 'Typed superset of JavaScript that compiles to plain JavaScript',
        category: 'language',
        popularity: 'high',
        website: 'https://typescriptlang.org'
      },
      { 
        id: 4, 
        name: 'MongoDB', 
        description: language === 'ru'
          ? 'Документо-ориентированная NoSQL база данных'
          : 'Document-oriented NoSQL database',
        category: 'database',
        popularity: 'medium',
        website: 'https://mongodb.com'
      },
      { 
        id: 5, 
        name: 'Docker', 
        description: language === 'ru'
          ? 'Платформа для контейнеризации приложений'
          : 'Platform for developing, shipping, and running applications in containers',
        category: 'tool',
        popularity: 'high',
        website: 'https://docker.com'
      },
      { 
        id: 6, 
        name: 'GraphQL', 
        description: language === 'ru'
          ? 'Язык запросов для API'
          : 'Query language for APIs',
        category: 'backend',
        popularity: 'medium',
        website: 'https://graphql.org'
      },
      { 
        id: 7, 
        name: 'Vue.js', 
        description: language === 'ru'
          ? 'Прогрессивный JavaScript-фреймворк'
          : 'Progressive JavaScript framework',
        category: 'frontend',
        popularity: 'high',
        website: 'https://vuejs.org'
      },
      { 
        id: 8, 
        name: 'PostgreSQL', 
        description: language === 'ru'
          ? 'Реляционная база данных с открытым исходным кодом'
          : 'Open source relational database',
        category: 'database',
        popularity: 'high',
        website: 'https://postgresql.org'
      },
      { 
        id: 9, 
        name: 'Next.js', 
        description: language === 'ru'
          ? 'React-фреймворк для продакшена'
          : 'The React Framework for Production',
        category: 'frontend',
        popularity: 'high',
        website: 'https://nextjs.org'
      },
      { 
        id: 10, 
        name: 'Express.js', 
        description: language === 'ru'
          ? 'Минималистичный веб-фреймворк для Node.js'
          : 'Minimalist web framework for Node.js',
        category: 'backend',
        popularity: 'high',
        website: 'https://expressjs.com'
      },
      { 
        id: 11, 
        name: 'Python', 
        description: language === 'ru'
          ? 'Высокоуровневый язык программирования общего назначения'
          : 'High-level general-purpose programming language',
        category: 'language',
        popularity: 'high',
        website: 'https://python.org'
      },
      { 
        id: 12, 
        name: 'Git', 
        description: language === 'ru'
          ? 'Распределённая система контроля версий'
          : 'Distributed version control system',
        category: 'tool',
        popularity: 'high',
        website: 'https://git-scm.com'
      }
    ];
  }, [language]);

  // Функция загрузки всех технологий (при начальной загрузке)
  const loadAllTechnologies = useCallback(() => {
    setLoading(true);
    
    // Имитация загрузки с небольшой задержкой
    setTimeout(() => {
      const mockTechnologies = getMockTechnologies();
      
      // Добавляем флаг, уже добавлена ли технология
      const resultsWithAddedFlag = mockTechnologies.map(tech => ({
        ...tech,
        isAdded: addedTechnologies.has(tech.name) || technologyExists(tech.name)
      }));

      setResults(resultsWithAddedFlag);
      setLoading(false);
      setInitialLoad(false);
    }, 300);
  }, [getMockTechnologies, addedTechnologies, technologyExists]);

  // Функция поиска технологий
  const searchTechnologies = useCallback(async (query) => {
    // Отменяем предыдущий запрос, если он существует
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Создаем новый AbortController
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      // Если запрос пустой - показываем все технологии
      if (!query.trim()) {
        loadAllTechnologies();
        return;
      }

      // Имитация API запроса с задержкой
      await new Promise(resolve => setTimeout(resolve, 600));

      const mockTechnologies = getMockTechnologies();

      // Фильтрация по запросу
      const filtered = mockTechnologies.filter(tech => 
        tech.name.toLowerCase().includes(query.toLowerCase()) ||
        tech.description.toLowerCase().includes(query.toLowerCase())
      );

      // Дополнительная фильтрация по категории
      const categoryFiltered = selectedCategory === 'all' 
        ? filtered 
        : filtered.filter(tech => tech.category === selectedCategory);

      // Добавляем флаг, уже добавлена ли технология
      const resultsWithAddedFlag = categoryFiltered.map(tech => ({
        ...tech,
        isAdded: addedTechnologies.has(tech.name) || technologyExists(tech.name)
      }));

      setResults(resultsWithAddedFlag);

    } catch (err) {
      // Игнорируем ошибки отмены запроса
      if (err.name !== 'AbortError') {
        setError(`${language === 'ru' ? 'Ошибка поиска:' : 'Search error:'} ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, language, addedTechnologies, technologyExists, loadAllTechnologies, getMockTechnologies]);

  // Обработчик изменения поиска с debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Очищаем предыдущий таймер
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Если поле поиска очищено, сразу показываем все технологии
    if (!value.trim()) {
      loadAllTechnologies();
      return;
    }

    // Устанавливаем новый таймер для debounce (600ms)
    searchTimeoutRef.current = setTimeout(() => {
      searchTechnologies(value);
    }, 600);
  };

  // Обработчик изменения категории
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    
    // Если есть поисковый запрос - фильтруем по нему
    if (searchTerm.trim()) {
      searchTechnologies(searchTerm);
    } else {
      // Иначе показываем все технологии в выбранной категории
      const mockTechnologies = getMockTechnologies();
      const filtered = category === 'all' 
        ? mockTechnologies 
        : mockTechnologies.filter(tech => tech.category === category);
      
      const resultsWithAddedFlag = filtered.map(tech => ({
        ...tech,
        isAdded: addedTechnologies.has(tech.name) || technologyExists(tech.name)
      }));
      
      setResults(resultsWithAddedFlag);
    }
  };

  // При монтировании компонента загружаем все технологии
  useEffect(() => {
    loadAllTechnologies();
  }, [loadAllTechnologies]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Функция добавления технологии в трекер
  const handleAddToTracker = (tech) => {
    try {
      // Проверяем, не добавлена ли уже эта технология
      if (technologyExists(tech.name)) {
        const message = language === 'ru' 
          ? `Технология "${tech.name}" уже есть в вашем трекере!`
          : `Technology "${tech.name}" is already in your tracker!`;
        alert(message);
        return;
      }

      // Создаем структуру для добавления
      const techToAdd = {
        title: tech.name,
        description: tech.description,
        category: tech.category || 'other'
      };

      // Добавляем через контекст
      addTechnology(techToAdd);
      
      // Добавляем в множество добавленных
      setAddedTechnologies(prev => new Set([...prev, tech.name]));
      
      // Обновляем флаг в результатах
      setResults(prev => prev.map(item => 
        item.name === tech.name ? { ...item, isAdded: true } : item
      ));

      // Показываем сообщение
      const successMessage = language === 'ru' 
        ? `✅ Технология "${tech.name}" добавлена в трекер!\nПерейдите на главную страницу, чтобы увидеть её.`
        : `✅ Technology "${tech.name}" added to tracker!\nGo to the home page to see it.`;
      
      alert(successMessage);

    } catch (err) {
      console.error('Ошибка при добавлении технологии:', err);
      const errorMessage = language === 'ru' 
        ? '❌ Ошибка при добавлении технологии'
        : '❌ Error adding technology';
      alert(errorMessage);
    }
  };

  // Получаем текст популярности из переводов
  const getPopularityText = (popularity) => {
    const icons = {
      high: '🔥',
      medium: '⚡',
      low: '✨'
    };
    
    const texts = {
      high: t.popularity.high,
      medium: t.popularity.medium,
      low: t.popularity.low
    };
    
    return `${icons[popularity]} ${texts[popularity]}`;
  };

  // Функция сброса фильтров
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    loadAllTechnologies();
  };

  return (
    <div className="api-search">
      <div className="search-header">
        <h2>{t.title}</h2>
        <p className="subtitle">{t.subtitle}</p>
        <div className="initial-hint">
          {language === 'ru' 
            ? 'Все доступные технологии загружены. Используйте поиск и фильтры для навигации.'
            : 'All available technologies are loaded. Use search and filters to navigate.'
          }
        </div>
      </div>

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
              title={language === 'ru' ? 'Очистить поиск' : 'Clear search'}
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
            <button 
              onClick={handleResetFilters}
              className="reset-filters-btn"
            >
              {language === 'ru' ? 'Сбросить фильтры' : 'Reset filters'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
          <button onClick={() => searchTechnologies(searchTerm)} className="retry-btn">
            {language === 'ru' ? 'Повторить' : 'Retry'}
          </button>
        </div>
      )}

      <div className="search-results">
        <div className="results-header">
          <div className="results-info">
            <h3>
              {searchTerm ? t.resultsFound : language === 'ru' ? 'Все технологии' : 'All technologies'}: 
              <span className="count">{results.length}</span>
            </h3>
            {!loading && initialLoad && (
              <p className="initial-message">
                {language === 'ru' 
                  ? '📚 Все доступные технологии для изучения'
                  : '📚 All available technologies for learning'
                }
              </p>
            )}
          </div>
          
          {searchTerm.trim() && !loading && results.length === 0 && (
            <p className="no-results">
              {t.noResults.replace('{{query}}', searchTerm)}
              <button onClick={handleResetFilters} className="show-all-btn">
                {language === 'ru' ? 'Показать все технологии' : 'Show all technologies'}
              </button>
            </p>
          )}
        </div>

        {loading && initialLoad ? (
          <div className="initial-loading">
            <div className="spinner"></div>
            <p>{language === 'ru' ? 'Загрузка технологий...' : 'Loading technologies...'}</p>
          </div>
        ) : (
          <div className="results-grid">
            {results.length > 0 ? (
              results.map(tech => (
                <div key={tech.id} className="tech-result-card">
                  <div className="tech-header">
                    <h4>{tech.name}</h4>
                    <div className="tech-badges">
                      <span className={`popularity-badge ${tech.popularity}`}>
                        {getPopularityText(tech.popularity)}
                      </span>
                      {tech.isAdded && (
                        <span className="added-badge">
                          ✅ {language === 'ru' ? 'Добавлено' : 'Added'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="tech-meta">
                    <span className="tech-category">
                      {t.techCategory} <strong>{categories.find(c => c.id === tech.category)?.name}</strong>
                    </span>
                  </div>

                  <p className="tech-description">{tech.description}</p>

                  <div className="tech-actions">
                    <a 
                      href={tech.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="website-link"
                    >
                      {t.officialWebsite}
                    </a>
                    <button 
                      onClick={() => handleAddToTracker(tech)}
                      className={`add-btn ${tech.isAdded ? 'disabled' : ''}`}
                      disabled={tech.isAdded}
                      title={tech.isAdded ? 
                        (language === 'ru' ? 'Уже добавлено' : 'Already added') : 
                        t.addToTracker
                      }
                    >
                      {tech.isAdded ? 
                        (language === 'ru' ? '✅ Добавлено' : '✅ Added') : 
                        t.addToTracker
                      }
                    </button>
                  </div>
                </div>
              ))
            ) : (
              !searchTerm.trim() && (
                <div className="empty-state">
                  <p>{language === 'ru' 
                    ? 'Технологии временно недоступны. Попробуйте позже.' 
                    : 'Technologies are temporarily unavailable. Try again later.'
                  }</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ApiSearch;
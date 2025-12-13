// src/components/ApiSearch.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTechnologies } from "../contexts/TechnologiesContext";
import { translations } from "../i18n/translations";
import "./ApiSearch.css";

function ApiSearch() {
  const { language } = useLanguage();
  const { addTechnology, technologyExists } = useTechnologies();
  const t = translations[language].apiSearch;

  // общая база для путей (важно для GitHub Pages)
  const BASE = import.meta.env.BASE_URL || "/";

  // Состояния поиска технологий
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [addedTechnologies, setAddedTechnologies] = useState(new Set());
  const [initialLoad, setInitialLoad] = useState(true);

  // Состояния ресурсов для технологий
  const [techResources, setTechResources] = useState({});
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [resourcesError, setResourcesError] = useState(null);
  const [activeResourceTech, setActiveResourceTech] = useState(null);

  // Для debounce и отмены запросов
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  const categories = [
    { id: "all",      name: t.categories.all },
    { id: "frontend", name: t.categories.frontend },
    { id: "backend",  name: t.categories.backend },
    { id: "database", name: t.categories.database },
    { id: "tool",     name: t.categories.tool },
    { id: "language", name: t.categories.language },
  ];

  // URL до JSON с технологиями в зависимости от языка
  const API_URL =
    language === "ru"
      ? `${BASE}api/technologies_ru.json`
      : `${BASE}api/technologies_en.json`;

  /**
   * Загрузка списка технологий из API
   */
  const fetchTechnologies = useCallback(
    async (query = "", category = "all") => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            language === "ru"
              ? "Не удалось загрузить данные"
              : "Failed to load data"
          );
        }

        const data = await response.json();

        let items = data;
        const trimmedQuery = query.trim().toLowerCase();

        if (trimmedQuery) {
          items = items.filter(
            (t) =>
              t.name.toLowerCase().includes(trimmedQuery) ||
              t.description.toLowerCase().includes(trimmedQuery)
          );
        }

        if (category !== "all") {
          items = items.filter((t) => t.category === category);
        }

        const processed = items.map((tech) => ({
          ...tech,
          isAdded:
            addedTechnologies.has(tech.name) ||
            technologyExists(tech.name),
        }));

        setResults(processed);
        setInitialLoad(false);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            (language === "ru" ? "Ошибка загрузки: " : "Load error: ") +
              err.message
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [API_URL, addedTechnologies, technologyExists, language]
  );

  const loadAllTechnologies = useCallback(() => {
    fetchTechnologies("", selectedCategory);
  }, [fetchTechnologies, selectedCategory]);

  const searchTechnologies = useCallback(
    (query) => {
      fetchTechnologies(query, selectedCategory);
    },
    [fetchTechnologies, selectedCategory]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value.trim()) {
      loadAllTechnologies();
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchTechnologies(value.trim());
    }, 600);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);

    if (searchTerm.trim()) {
      searchTechnologies(searchTerm.trim());
    } else {
      loadAllTechnologies();
    }
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
      alert(
        language === "ru"
          ? `Технология "${tech.name}" уже добавлена!`
          : `Technology "${tech.name}" already exists!`
      );
      return;
    }

    addTechnology({
      title: tech.name,
      description: tech.description,
      category: tech.category,
    });

    setAddedTechnologies((prev) => new Set([...prev, tech.name]));
    setResults((prev) =>
      prev.map((item) =>
        item.name === tech.name ? { ...item, isAdded: true } : item
      )
    );

    alert(
      language === "ru"
        ? `Технология "${tech.name}" добавлена!`
        : `Technology "${tech.name}" added!`
    );
  };

  const getPopularityText = (p) => {
    const icons = { high: "🔥", medium: "⚡", low: "✨" };
    const texts = {
      high: t.popularity.high,
      medium: t.popularity.medium,
      low: t.popularity.low,
    };
    return `${icons[p]} ${texts[p]}`;
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    loadAllTechnologies();
  };

  /**
   * 🔥 Toggle-загрузка ресурсов:
   * - повторный клик → сворачивает
   * - если ресурсы уже есть → не грузим повторно
   */
  const loadResources = async (techName) => {
    if (activeResourceTech === techName) {
      setActiveResourceTech(null);
      setResourcesError(null);
      return;
    }

    setActiveResourceTech(techName);
    setResourcesError(null);

    if (techResources[techName]) {
      return;
    }

    setResourcesLoading(true);

    const filename =
      techName.toLowerCase().replace(/\.js$/, "").trim() + ".json";

    const url = `${BASE}api/resources/${filename}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to load resources");

      const data = await response.json();

      setTechResources((prev) => ({
        ...prev,
        [techName]: data.resources,
      }));
    } catch (err) {
      setResourcesError(err.message);
    } finally {
      setResourcesLoading(false);
    }
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

          {loading && (
            <span className="loading-indicator">{t.searchLoading}</span>
          )}

          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                loadAllTechnologies();
              }}
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
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-btn ${
                    selectedCategory === cat.id ? "active" : ""
                  }`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {(searchTerm || selectedCategory !== "all") && (
            <button
              className="reset-filters-btn"
              onClick={handleResetFilters}
            >
              {language === "ru" ? "Сбросить фильтры" : "Reset filters"}
            </button>
          )}
        </div>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}

      <div className="search-results">
        <div className="results-grid">
          {results.map((tech) => (
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
                    {language === "ru" ? "Добавлено" : "Added"}
                  </span>
                )}
              </div>

              <div className="tech-meta">
                <span className="tech-category">
                  {t.techCategory}{" "}
                  <strong>
                    {categories.find((c) => c.id === tech.category)?.name}
                  </strong>
                </span>
              </div>

              <p className="tech-description">{tech.description}</p>

              <div className="tech-actions">
                <button
                  type="button"
                  className="website-link"
                  onClick={() => loadResources(tech.name)}
                >
                  {activeResourceTech === tech.name
                    ? language === "ru"
                      ? "Скрыть ресурсы"
                      : "Hide resources"
                    : language === "ru"
                    ? "Показать ресурсы"
                    : "Show resources"}
                </button>

                <button
                  className={`add-btn ${tech.isAdded ? "disabled" : ""}`}
                  disabled={tech.isAdded}
                  onClick={() => handleAddToTracker(tech)}
                >
                  {tech.isAdded
                    ? language === "ru"
                      ? "Добавлено"
                      : "Added"
                    : t.addToTracker}
                </button>
              </div>

              {activeResourceTech === tech.name && resourcesLoading && (
                <p className="loading-small">
                  {language === "ru"
                    ? "Загрузка ресурсов..."
                    : "Loading resources..."}
                </p>
              )}

              {activeResourceTech === tech.name && resourcesError && (
                <p className="error-small">
                  {language === "ru"
                    ? "Ошибка загрузки ресурсов"
                    : "Error loading resources"}
                </p>
              )}

              {techResources[tech.name] && activeResourceTech === tech.name && (
                <div className="resource-list">
                  <h5>{language === "ru" ? "Ресурсы:" : "Resources:"}</h5>

                  {techResources[tech.name].map((res, index) => (
                    <div key={index} className="resource-item">
                      <span className="res-type">{res.type}</span>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {res.title}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {!loading && !error && results.length === 0 && !initialLoad && (
            <p className="no-results">
              {language === "ru"
                ? "Ничего не найдено по заданным параметрам"
                : "No technologies found for given filters"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApiSearch;

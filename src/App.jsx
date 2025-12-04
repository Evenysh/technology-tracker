// src/App.jsx
import './App.css';
import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';

function App() {
  const technologies = [
    { id: 1, title: 'React Components', description: 'Изучение базовых компонентов', status: 'completed' },
    { id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status: 'in-progress' },
    { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'not-started' },
    { id: 4, title: 'React Hooks', description: 'Изучение useState, useEffect', status: 'completed' },
    { id: 5, title: 'React Router', description: 'Маршрутизация в React', status: 'not-started' }
  ];

  return (
    <div className="App">
      <h1>Трекер изучения технологий</h1>
      
      <ProgressHeader technologies={technologies} />
      
      <div className="technologies-list">
        {technologies.map(tech => (
          <TechnologyCard
            key={tech.id}
            title={tech.title}
            description={tech.description}
            status={tech.status}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
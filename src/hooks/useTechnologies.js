// src/hooks/useTechnologies.js
import useLocalStorage from './useLocalStorage';

const initialTechnologies = [
  { id: 1, title: 'React Components', description: 'Изучение базовых компонентов', status: 'not-started', notes: '', category: 'frontend' },
  { id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status: 'not-started', notes: '', category: 'frontend' },
  { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'not-started', notes: '', category: 'frontend' },
  { id: 4, title: 'React Hooks', description: 'Изучение useState, useEffect', status: 'not-started', notes: '', category: 'frontend' },
  { id: 5, title: 'React Router', description: 'Маршрутизация в React', status: 'not-started', notes: '', category: 'frontend' }
];

function useTechnologies() {
  const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);

  const updateStatus = (techId, newStatus) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, status: newStatus } : tech
      )
    );
  };

  const updateNotes = (techId, newNotes) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  const calculateProgress = () => {
    if (technologies.length === 0) return 0;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  };

  const markAllCompleted = () => {
    setTechnologies(prev =>
      prev.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  const resetAllStatuses = () => {
    setTechnologies(prev =>
      prev.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

  const toggleStatus = (techId) => {
    setTechnologies(prev =>
        prev.map(tech => {
        if (tech.id === techId) {
            const statusOrder = ['not-started', 'in-progress', 'completed'];
            const currentIndex = statusOrder.indexOf(tech.status);
            const nextIndex = (currentIndex + 1) % statusOrder.length;
            return { ...tech, status: statusOrder[nextIndex] };
        }
        return tech;
        })
    );
  };

  return {
    technologies,
    setTechnologies,
    updateStatus,
    updateNotes,
    toggleStatus,
    markAllCompleted,
    resetAllStatuses,
    progress: calculateProgress()
  };
}

export default useTechnologies;
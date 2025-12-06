// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

// Кастомный хук для работы с localStorage
function useLocalStorage(key, initialValue) {
  // Проверяем, что мы в браузере (не на сервере)
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Ошибка чтения из localStorage:', error);
      return initialValue;
    }
  });

  // Функция для обновления значения в состоянии и localStorage
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('Ошибка записи в localStorage:', error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const { getUserStorageKey } = useUser();
  const userSpecificKey = getUserStorageKey(key);

  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(userSpecificKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${userSpecificKey}":`, error);
      return initialValue;
    }
  });

  // Update stored value when user changes
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(userSpecificKey);
      const newValue = item ? JSON.parse(item) : initialValue;
      setStoredValue(newValue);
    } catch (error) {
      console.error(`Error reading localStorage key "${userSpecificKey}":`, error);
      setStoredValue(initialValue);
    }
  }, [userSpecificKey, initialValue]);

  // Update localStorage when value changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(userSpecificKey, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${userSpecificKey}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
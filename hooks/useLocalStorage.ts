
import React, { useState, useEffect } from 'react';

function getValue<T>(key: string, initialValue: T | (() => T)): T {
  const savedValue = localStorage.getItem(key);
  if (savedValue) {
    try {
        // Special handling for Set objects
      const parsed = JSON.parse(savedValue, (k, v) => {
        if (typeof v === 'object' && v !== null && v.__dataType === 'Set') {
          return new Set(v.value);
        }
        return v;
      });
      return parsed;
    } catch (error) {
      console.error('Error parsing JSON from localStorage', error);
      localStorage.removeItem(key);
    }
  }

  if (initialValue instanceof Function) {
    return initialValue();
  }
  return initialValue;
}


export function useLocalStorage<T>(key: string, initialValue: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => getValue(key, initialValue));

  useEffect(() => {
    try {
        const valueToStore = JSON.stringify(value, (k, v) => {
            if(v instanceof Set) {
                return {
                    __dataType: 'Set',
                    value: [...v]
                };
            }
            return v;
        });
        localStorage.setItem(key, valueToStore);
    } catch (error) {
        console.error('Error setting value to localStorage', error);
    }
  }, [key, value]);

  return [value, setValue];
}
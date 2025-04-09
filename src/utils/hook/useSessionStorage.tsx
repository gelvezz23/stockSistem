/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";

export const useSessionStorage = (key: string, initialValue: any) => {
  const getData = () => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error sessionStorage not found : ${key}`, error);
      return initialValue;
    }
  };
  const data = getData();
  const [storage, setStorage] = useState(data);

  const setValue = useCallback(
    (value: any) => {
      try {
        const valueStorage = value instanceof Function ? value(storage) : value;
        setStorage(valueStorage);
        window.sessionStorage.setItem(key, JSON.stringify(valueStorage));
      } catch (error) {
        console.error(`Error settings by ${key}: `, error);
      }
    },
    [key, storage]
  );

  const removeValue = useCallback(() => {
    try {
      window.sessionStorage.removeItem(key);
      setStorage(initialValue);
    } catch (error) {
      console.log(`Error removing item from ${key}`, error);
    }
  }, [initialValue, key]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent | Event | any) => {
      if (event instanceof CustomEvent && event.detail.key === key) {
        setStorage(event.detail.value);
      }

      if (event.key === key) {
        try {
          const newValue = event.newValue
            ? JSON.parse(event.newValue)
            : initialValue;
          setStorage(newValue);
        } catch (error) {
          console.log(`Error parsing sessionStorage : ${key}`, error);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [initialValue, key, storage]);

  return { storage, setValue, removeValue };
};

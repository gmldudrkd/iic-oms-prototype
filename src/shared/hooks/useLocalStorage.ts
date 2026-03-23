import { useState } from "react";

/**
 * @param key - 로컬스토리지 키
 * @param initialValue - 초기값
 * @returns [storedValue, setValue] - 로컬스토리지 값과 설정 함수
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const parsed = JSON.parse(item);

      return parsed;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // ✅ 값 설정 및 로컬스토리지 업데이트
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // 이전 값과 동일하면 저장 생략
      const prevRaw =
        typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      const prevValue = prevRaw ? JSON.parse(prevRaw) : null;
      const isSame = JSON.stringify(prevValue) === JSON.stringify(valueToStore);
      if (isSame) return;

      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

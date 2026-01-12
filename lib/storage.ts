export const storage = {
  /**
   * Safe wrapper for localStorage.getItem
   */
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.error("Error retrieving from localStorage", error);
      return null;
    }
  },

  /**
   * Safe wrapper for localStorage.setItem
   */
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }
  },

  /**
   * Safe wrapper for localStorage.removeItem
   */
  removeItem: (key: string): void => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage", error);
    }
  },

  /**
   * Store a JSON value in localStorage
   */
  setJSON: <T>(key: string, value: T): void => {
    if (typeof window === "undefined") return;
    try {
      const jsonValue = JSON.stringify(value);
      window.localStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error("Error saving JSON to localStorage", error);
    }
  },

  /**
   * Retrieve and parse a JSON value from localStorage
   */
  getJSON: <T>(key: string): T | null => {
    if (typeof window === "undefined") return null;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error("Error retrieving JSON from localStorage", error);
      return null;
    }
  },
};

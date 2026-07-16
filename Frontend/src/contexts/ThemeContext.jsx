import { createContext, useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "elexoplus_preferences";

const getInitialPreferences = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return {
    theme: "dark",
    fontSize: "medium",
    reducedMotion: false,
    compactMode: false,
  };
};

const applyAttributes = (prefs) => {
  document.documentElement.setAttribute("data-theme", prefs.theme);
  document.documentElement.setAttribute("data-font-size", prefs.fontSize);
  document.documentElement.setAttribute("data-reduced-motion", prefs.reducedMotion);
};

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(getInitialPreferences);

  useEffect(() => {
    applyAttributes(preferences);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const updateTheme = useCallback((theme) => {
    setPreferences((prev) => ({ ...prev, theme }));
  }, []);

  const updateFontSize = useCallback((fontSize) => {
    setPreferences((prev) => ({ ...prev, fontSize }));
  }, []);

  const updateReducedMotion = useCallback((reducedMotion) => {
    setPreferences((prev) => ({ ...prev, reducedMotion }));
  }, []);

  const updateCompactMode = useCallback((compactMode) => {
    setPreferences((prev) => ({ ...prev, compactMode }));
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        ...preferences,
        updateTheme,
        updateFontSize,
        updateReducedMotion,
        updateCompactMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

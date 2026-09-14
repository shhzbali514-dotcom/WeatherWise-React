// ==========================================
// SETTINGS CONTEXT - GLOBAL SETTINGS STATE
// ==========================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from '../utils/helpers';

// ==========================================
// CONTEXT
// ==========================================

const SettingsContext = createContext(null);

// ==========================================
// CUSTOM HOOK
// ==========================================

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      'useSettings must be used within SettingsProvider'
    );
  }

  return context;
};

// ==========================================
// PROVIDER
// ==========================================

export const SettingsProvider = ({ children }) => {
  // ==========================================
  // STATE
  // ==========================================

  const [theme, setTheme] = useState(() => {
    return loadFromLocalStorage('theme') || 'dark';
  });

  const [unit, setUnit] = useState(() => {
    return loadFromLocalStorage('unit') || 'celsius';
  });

  const [windUnit, setWindUnitState] = useState(() => {
    return loadFromLocalStorage('windUnit') || 'kmh';
  });

  const [alerts, setAlerts] = useState(() => {
    const saved = loadFromLocalStorage('alerts');
    return saved !== null && saved !== undefined
      ? saved
      : true;
  });

  const [dailyForecast, setDailyForecast] = useState(() => {
    const saved = loadFromLocalStorage('daily');
    return saved !== null && saved !== undefined
      ? saved
      : false;
  });

  const [aqiAlerts, setAqiAlerts] = useState(() => {
    const saved = loadFromLocalStorage('aqi');
    return saved !== null && saved !== undefined
      ? saved
      : true;
  });

  const [locationAccess, setLocationAccess] = useState(() => {
    const saved = loadFromLocalStorage('location');
    return saved !== null && saved !== undefined
      ? saved
      : true;
  });

  const [accentColor, setAccentColor] = useState(() => {
    return loadFromLocalStorage('accent') || '#6366f1';
  });

  // ==========================================
  // APPLY THEME
  // ==========================================

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      theme
    );
  }, [theme]);

  // ==========================================
  // APPLY ACCENT COLOR
  // ==========================================

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--primary',
      accentColor
    );
  }, [accentColor]);

  // ==========================================
  // THEME
  // ==========================================

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const newTheme =
        currentTheme === 'dark' ? 'light' : 'dark';

      saveToLocalStorage('theme', newTheme);

      return newTheme;
    });
  };

  // ==========================================
  // TEMPERATURE UNIT
  // ==========================================

  const toggleUnit = () => {
    setUnit((currentUnit) => {
      const newUnit =
        currentUnit === 'celsius'
          ? 'fahrenheit'
          : 'celsius';

      saveToLocalStorage('unit', newUnit);

      return newUnit;
    });
  };

  // ==========================================
  // WIND UNIT
  // ==========================================

  const setWindUnit = (newUnit) => {
    setWindUnitState(newUnit);
    saveToLocalStorage('windUnit', newUnit);
  };

  // ==========================================
  // TOGGLE SETTINGS
  // ==========================================

  const toggleSetting = (key) => {
    const settings = {
      alerts: [alerts, setAlerts],
      daily: [dailyForecast, setDailyForecast],
      aqi: [aqiAlerts, setAqiAlerts],
      location: [locationAccess, setLocationAccess],
    };

    const setting = settings[key];

    if (!setting) {
      console.warn(
        `Unknown setting: ${key}`
      );
      return;
    }

    const [currentValue, setter] = setting;
    const newValue = !currentValue;

    setter(newValue);

    saveToLocalStorage(key, newValue);
  };

  // ==========================================
  // ACCENT COLOR
  // ==========================================

  const setAccent = (color) => {
    if (!color) return;

    setAccentColor(color);
    saveToLocalStorage('accent', color);
  };

  // ==========================================
  // RESET SETTINGS
  // ==========================================

  const resetSettings = () => {
    const defaultSettings = {
      theme: 'dark',
      unit: 'celsius',
      windUnit: 'kmh',
      alerts: true,
      daily: false,
      aqi: true,
      location: true,
      accent: '#6366f1',
    };

    setTheme(defaultSettings.theme);
    setUnit(defaultSettings.unit);
    setWindUnitState(defaultSettings.windUnit);
    setAlerts(defaultSettings.alerts);
    setDailyForecast(defaultSettings.daily);
    setAqiAlerts(defaultSettings.aqi);
    setLocationAccess(defaultSettings.location);
    setAccentColor(defaultSettings.accent);

    Object.entries(defaultSettings).forEach(
      ([key, value]) => {
        saveToLocalStorage(key, value);
      }
    );
  };

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = {
    theme,
    unit,
    windUnit,
    alerts,
    dailyForecast,
    aqiAlerts,
    locationAccess,
    accentColor,

    toggleTheme,
    toggleUnit,
    toggleSetting,

    setWindUnit,
    setAccent,

    resetSettings,
  };

  // ==========================================
  // PROVIDER
  // ==========================================

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
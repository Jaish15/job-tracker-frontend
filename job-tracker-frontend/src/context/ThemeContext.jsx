import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ACCENT_COLORS = {
  indigo:  { label: 'Indigo',  hex: '#6366f1', soft: '#eef2ff', glow: 'rgba(99,102,241,0.3)'  },
  emerald: { label: 'Emerald', hex: '#10b981', soft: '#ecfdf5', glow: 'rgba(16,185,129,0.3)'  },
  amber:   { label: 'Amber',   hex: '#f59e0b', soft: '#fffbeb', glow: 'rgba(245,158,11,0.3)'  },
  rose:    { label: 'Rose',    hex: '#f43f5e', soft: '#fff1f2', glow: 'rgba(244,63,94,0.3)'   },
  cyan:    { label: 'Cyan',    hex: '#06b6d4', soft: '#ecfeff', glow: 'rgba(6,182,212,0.3)'   },
};

function applyAccent(key) {
  const color = ACCENT_COLORS[key] || ACCENT_COLORS.indigo;
  const root = document.documentElement;
  root.style.setProperty('--accent',      color.hex);
  root.style.setProperty('--accent-soft', color.soft);
  root.style.setProperty('--accent-glow', color.glow);
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark'
  );
  const [accentKey, setAccentKey] = useState(
    () => localStorage.getItem('accent') || 'indigo'
  );

  // Apply dark / light on every change
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Apply accent on every change
  useEffect(() => {
    applyAccent(accentKey);
    localStorage.setItem('accent', accentKey);
  }, [accentKey]);

  // Apply stored values immediately on first mount
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    applyAccent(localStorage.getItem('accent') || 'indigo');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, accentKey, setAccentKey }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ACCENT_COLORS = {
  indigo:  { label: 'Indigo',   hex: '#6366f1', soft: '#eef2ff', glow: 'rgba(99,102,241,0.35)'  },
  emerald: { label: 'Emerald',  hex: '#10b981', soft: '#ecfdf5', glow: 'rgba(16,185,129,0.35)'  },
  amber:   { label: 'Amber',    hex: '#f59e0b', soft: '#fffbeb', glow: 'rgba(245,158,11,0.35)'  },
  rose:    { label: 'Rose',     hex: '#f43f5e', soft: '#fff1f2', glow: 'rgba(244,63,94,0.35)'   },
  cyan:    { label: 'Cyan',     hex: '#06b6d4', soft: '#ecfeff', glow: 'rgba(6,182,212,0.35)'   },
};

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [accentKey, setAccentKey] = useState(() => localStorage.getItem('accent') || 'indigo');

  // Apply dark / light theme
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Apply accent color as CSS custom properties
  useEffect(() => {
    const accent = ACCENT_COLORS[accentKey] || ACCENT_COLORS.indigo;
    const root = document.documentElement;
    root.style.setProperty('--accent',      accent.hex);
    root.style.setProperty('--accent-soft', accent.soft);
    root.style.setProperty('--accent-glow', accent.glow);
    localStorage.setItem('accent', accentKey);
  }, [accentKey]);

  // On first mount, also apply stored accent color immediately
  useEffect(() => {
    const accent = ACCENT_COLORS[accentKey] || ACCENT_COLORS.indigo;
    const root = document.documentElement;
    root.style.setProperty('--accent',      accent.hex);
    root.style.setProperty('--accent-soft', accent.soft);
    root.style.setProperty('--accent-glow', accent.glow);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, accentKey, setAccentKey }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

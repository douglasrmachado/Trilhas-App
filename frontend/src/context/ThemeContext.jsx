import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggle = useCallback(() => setIsDarkMode((v) => !v), []);

  const colors = useMemo(() => ({
    background: isDarkMode ? '#0f172a' : '#ffffff',
    text: isDarkMode ? '#e2e8f0' : '#111827',
    primary: isDarkMode ? '#1e90ff' : '#1e90ff',
    danger: isDarkMode ? '#ef4444' : '#ff4d4f',
    headerBg: isDarkMode ? '#0f172a' : '#ffffff',
    headerText: isDarkMode ? '#e2e8f0' : '#111827',
  }), [isDarkMode]);

  const theme = useMemo(() => ({
    isDarkMode,
    toggle,
    colors,
  }), [isDarkMode, toggle, colors]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}



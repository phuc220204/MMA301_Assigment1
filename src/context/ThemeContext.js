import { createContext, useContext, useMemo, useState } from 'react';

import { darkColors, lightColors } from '../theme/colors';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState('light');
  const isDark = themeMode === 'dark';

  const value = useMemo(
    () => ({
      themeMode,
      isDark,
      colors: isDark ? darkColors : lightColors,
      toggleTheme: () => setThemeMode((current) => (current === 'light' ? 'dark' : 'light')),
    }),
    [isDark, themeMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider.');
  }

  return context;
}

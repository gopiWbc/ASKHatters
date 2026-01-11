import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { getThemeColors, ThemeColors, ThemeMode, lightColors } from './colors';

export type AppThemeContextValue = {
  mode: ThemeMode;
  colors: ThemeColors;
};

const defaultMode: ThemeMode = 'light';
const AppThemeContext = createContext<AppThemeContextValue>({
  mode: defaultMode,
  colors: lightColors,
});

export const AppThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const mode: ThemeMode = colorScheme === 'dark' ? 'dark' : 'light';

  const value = useMemo<AppThemeContextValue>(() => {
    const colors = getThemeColors(mode);
    return { mode, colors };
  }, [mode]);

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
};

export const useAppTheme = () => useContext(AppThemeContext);

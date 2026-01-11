export type ThemeColors = {
  primary: string;
  primaryLight: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  backgroundSecondary: string;
  surface: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  divider: string;
  white: string;
  black: string;
  darkGray: string;
  overlay: string;
  inputBackground: string;
  disabled: string;
  placeholder: string;
  yellow: string;
};

export const lightColors: ThemeColors = {
  // Luton Town Official Orange (#F78F1E)
  primary: '#F78F1E', 
  primaryLight: '#FEEBD0',
  // Luton Town Official Navy (#002D62)
  secondary: '#002D62', 
  success: '#259d2bff',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
  background: '#FAFAFA',
  backgroundSecondary: '#F2F2F2',
  surface: '#FFFFFF',
  text: '#1C1C1E',
  textSecondary: '#6B6B6B',
  textTertiary: '#A1A1A1',
  border: '#E5E5EA',
  divider: '#D1D1D6',
  white: '#FFFFFF',
  black: '#000000',
  darkGray: '#3A3B3C',
  overlay: 'rgba(0,0,0,0.5)',
  inputBackground: '#F3F3F3',
  disabled: '#DCDCDC',
  placeholder: '#6C757D',
  // Accent Yellow from the crest
  yellow: '#FFCD16', 
};

export const darkColors: ThemeColors = {
  ...lightColors,
  // Deep Navy adjustment for Dark Mode primary light
  primaryLight: '#4d2a06', 
  background: '#0F0F10',
  backgroundSecondary: '#1A1A1C',
  surface: '#1F1F20',
  text: '#F5F5F7',
  textSecondary: '#C7C7CC',
  textTertiary: '#8E8E93',
  border: '#2C2C2E',
  divider: '#3A3A3C',
  overlay: 'rgba(0,0,0,0.65)',
  inputBackground: '#2C2C2E',
  disabled: '#3A3A3C',
  placeholder: '#8E8E93',
};

export type ThemeMode = 'light' | 'dark';

export const getThemeColors = (mode: ThemeMode): ThemeColors =>
  mode === 'dark' ? darkColors : lightColors;
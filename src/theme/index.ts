import { StyleSheet } from 'react-native';
import { lightColors } from './colors';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 56,
} as const;

export const typography = {
  fontFamily: {
    regular: 'Lexend-Regular',
    medium: 'Lexend-Medium',
    semibold: 'Lexend-SemiBold',
    bold: 'Lexend-Bold',
  },
  fontSizes: {
    xs: 13,
    sm: 15,
    md: 18,
    lg: 20,
    xl: 24,
    xxl: 28,
    xxxl: 32,
  },
  fontWeights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '600',
  },
  lineHeights: {
    xs: 12,
    sm: 13,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
} as const;

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 1.5,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  e1: {
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  e2: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  e3: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  e4: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  e5: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
} as const;

export const FlexStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexgrow: {
    flexGrow: 1,
  },
  rowStart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colCenter: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colAlignCenter: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  colJustifyCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowAround: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export const TextStyle = StyleSheet.create({
  regular: {
    fontFamily: typography.fontFamily.regular,
  },
  medium: {
    fontFamily: typography.fontFamily.medium,
  },
  semibold: {
    fontFamily: typography.fontFamily.semibold,
  },
  bold: {
    fontFamily: typography.fontFamily.bold,
  },
});

// ------soon to be removed ------

export const theme = {
  colors: lightColors,
  spacing,
  typography,
  borderRadius,
  shadows,
} as const;
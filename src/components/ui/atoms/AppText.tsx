import React, { ReactNode, useMemo } from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';
import { useAppTheme } from '../../../theme/ThemeProvider';
import { typography } from '../../../theme';
import type { ThemeColors, ThemeMode } from '../../../theme/colors';

type TypographyTokens = typeof typography;

export type AppTextVariant = keyof TypographyTokens['fontSizes'];
export type AppTextWeight = keyof TypographyTokens['fontFamily'];
export type AppTextLineHeight = keyof TypographyTokens['lineHeights'];
export type AppTextTone =
  | 'default'
  | 'secondary'
  | 'muted'
  | 'inverse'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error';

export interface AppTextProps extends TextProps {
  children?: ReactNode;
  text?:string;
  variant?: AppTextVariant;
  weight?: AppTextWeight;
  tone?: AppTextTone;
  lineHeight?: AppTextLineHeight;
  align?: TextStyle['textAlign'];
  uppercase?: boolean;
  style?: StyleProp<TextStyle>;
}

const toneColor = (tone: AppTextTone, colors: ThemeColors, mode: ThemeMode) => {
  switch (tone) {
    case 'secondary':
      return colors.textSecondary;
    case 'muted':
      return colors.textTertiary;
    case 'inverse':
      return mode === 'dark' ? colors.text : colors.white;
    case 'primary':
      return colors.primary;
    case 'success':
      return colors.success;
    case 'warning':
      return colors.warning;
    case 'error':
      return colors.error;
    case 'default':
    default:
      return colors.text;
  }
};

const resolveFontFamily = (weight: AppTextWeight) => {
  const mapping = typography.fontFamily;
  return mapping[weight] ?? mapping.regular;
};

const resolveFontWeight = (weight: AppTextWeight) => {
  const mapping = typography.fontWeights;
  return mapping[weight] ?? mapping.regular;
};

const AppText: React.FC<AppTextProps> = ({
  children,
  text,
  variant = 'md',
  weight = 'regular',
  tone = 'default',
  align,
  uppercase = false,
  allowFontScaling = true,
  style,
  ...rest
}) => {
  const { colors, mode } = useAppTheme();

  const textStyle = useMemo(() => {
    const fontSize = typography.fontSizes[variant];
    const fontFamily = resolveFontFamily(weight);
    const fontWeight = resolveFontWeight(weight);
    const color = toneColor(tone, colors, mode);

    const baseStyle: TextStyle = {
      fontSize,
      fontFamily,
      fontWeight,
      color,
      textAlign: align,
      textTransform: uppercase ? 'uppercase' : undefined,
    };

    return baseStyle;
  }, [align, tone, uppercase, variant, weight, mode]);

  return (
    <Text allowFontScaling={allowFontScaling} style={[textStyle, style]} {...rest}>
      {text??children}
    </Text>
  );
};

export default AppText;

import React, { useMemo, useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Animated,
} from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';
import { ThemeColors } from '@/theme/colors';
import AppText from '@/components/ui/atoms/AppText';
import { FlexStyle } from '@/theme';
import ClickableView from './ClickableOpacity';

export interface ToggleOption {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

interface AppMultiToggleProps {
  options: ToggleOption[];
  selectedValue: string | number;
  onValueChange: (value: string | number) => void;
  style?: ViewStyle;
  activeColor?: string;
  inactiveTextColor?: string;
  activeTextColor?: string;
  borderRadius?: number;
  height?: number;
  disabled?: boolean;
  animated?: boolean;
  padding?: number;
}

const AppMultiToggle: React.FC<AppMultiToggleProps> = ({
  options,
  selectedValue,
  onValueChange,
  style,
  activeColor,
  activeTextColor,
  inactiveTextColor,
  borderRadius = 16,
  height = 40, // reduced height
  disabled = false,
  animated = true,
  padding = 2,
}) => {
  const { colors } = useAppTheme();

  const styles = useMemo(
    () => createStyles(colors, borderRadius, height, padding),
    [colors, borderRadius, height, padding],
  );

  const slideAnim = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);

  const selectedIndex = options.findIndex(
    opt => opt.value === selectedValue,
  );

  useEffect(() => {
    if (!animated || containerWidth === 0) return;

    Animated.spring(slideAnim, {
      toValue: selectedIndex,
      useNativeDriver: false,
      friction: 8,
      tension: 90,
    }).start();
  }, [selectedIndex, animated, containerWidth]);

  const handlePress = (value: string | number) => {
    if (!disabled && value !== selectedValue) {
      onValueChange(value);
    }
  };

  const buttonWidth =
    containerWidth > 0
      ? (containerWidth - padding * 2) / options.length
      : 0;

  const translateX = slideAnim.interpolate({
    inputRange: options.map((_, i) => i),
    outputRange: options.map((_, i) => i * buttonWidth),
  });

  return (
    <View
      style={[styles.container, style]}
      onLayout={e =>
        setContainerWidth(e.nativeEvent.layout.width)
      }
    >
      {/* Animated Slider */}
      {animated && containerWidth > 0 && (
        <Animated.View
          style={[
            styles.slider,
            {
              width: buttonWidth - padding * 2,
              backgroundColor: activeColor || colors.primary,
              transform: [{ translateX }],
            },
          ]}
        />
      )}

      {options.map(option => {
        const isActive = option.value === selectedValue;

        return (
          <ClickableView
            key={option.value}
            style={styles.button}
            onClick={() => handlePress(option.value)}
            activeOpacity={0.7}
            disabled={disabled}
          >
            <View style={styles.buttonContent}>
              {option.icon}
              <AppText
                text={option.label}
                variant="sm"
                weight={isActive ? 'semibold' : 'medium'}
                style={{
                  color: isActive
                    ? activeTextColor || colors.white
                    : inactiveTextColor || colors.textSecondary,
                  zIndex: 2,
                }}
              />
            </View>
          </ClickableView>
        );
      })}
    </View>
  );
};

const createStyles = (
  colors: ThemeColors,
  borderRadius: number,
  height: number,
  padding: number,
) =>
  StyleSheet.create({
    container: {
      ...FlexStyle.rowCenter,
      backgroundColor: colors.backgroundSecondary,
      borderRadius,
      padding,
      borderWidth: 1,
      borderColor: colors.border,
      position: 'relative',
    },
    button: {
      flex: 1,
      height: height - padding * 2,
      ...FlexStyle.colCenter,
      borderRadius: borderRadius - padding,
      paddingHorizontal: 8,
      zIndex: 1,
    },
    buttonContent: {
      ...FlexStyle.rowCenter,
      gap: 4,
    },
    slider: {
      position: 'absolute',
      height: height - padding * 2,
      borderRadius: borderRadius - padding,
      left: padding,
      top: padding,
      zIndex: 0,
    },
  });

export default AppMultiToggle;

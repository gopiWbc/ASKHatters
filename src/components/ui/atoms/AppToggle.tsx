import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import AppText from '../atoms/AppText';
import { useAppTheme } from '@/theme/ThemeProvider';
import { FlexStyle, spacing } from '@/theme';
import { ThemeColors } from '@/theme/colors';

interface AppToggleProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  errorMessage?: string;
  note?: string;
}

const AppToggle: React.FC<AppToggleProps> = ({
  label,
  value,
  onChange,
  disabled,
  errorMessage,
  note,
}) => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const translateX = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 1 : 0,
      useNativeDriver: true,
      speed: 14,
      bounciness: 8,
    }).start();
  }, [value, translateX]);

  const thumbPosition = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 23],
  });

  const handleToggle = () => {
    if (!disabled) {
      onChange(!value);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleToggle}
        style={styles.toggleContainer}
        disabled={disabled}
      >
        <View
          style={[
            styles.track,
            value && styles.trackActive,
            disabled && styles.trackDisabled,
          ]}
        >
          <Animated.View
            style={[
              styles.thumb,
              {
                transform: [{ translateX: thumbPosition }],
              },
            ]}
          />
        </View>

        <AppText style={[disabled && styles.labelDisabled]} variant='sm' >
          {label}
        </AppText>
      </Pressable>

      {!!errorMessage && (
        <AppText variant="xs" tone="error" style={styles.message}>
          {errorMessage}
        </AppText>
      )}

      {!!note && !errorMessage && (
        <AppText variant="xs" tone="secondary" style={styles.message}>
          {note}
        </AppText>
      )}
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginTop: spacing.sm,
    },
    toggleContainer:{
        ...FlexStyle.rowStart,
        gap:4
    },
    track: {
      width: 48,
      height: 26,
      borderRadius: 13,
      backgroundColor: colors.border,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: 'center',
    },
    trackActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    trackDisabled: {
      opacity: 0.5,
    },
    thumb: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.white,
    },
    labelDisabled: {
      opacity: 0.5,
    },
    message: {
      marginTop: 4,
    },
  });

export default AppToggle;
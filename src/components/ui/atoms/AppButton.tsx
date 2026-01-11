import React from 'react';
import {
  StyleSheet,
  ViewStyle,
  StyleProp,
  View,
} from 'react-native';
import AppText, { AppTextVariant, AppTextWeight } from '../atoms/AppText';
import { useAppTheme } from '@/theme/ThemeProvider';
import { FlexStyle, spacing } from '@/theme';
import { ThemeColors } from '@/theme/colors';
import AppActivityLoader from './AppActivityLoader';
import ClickableView from './ClickableOpacity';

export type AppButtonVariant = 'primary' | 'secondary';

interface AppButtonProps {
  title: string;
  onClick: () => void;
  variant?: AppButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textVariant?: AppTextVariant;
  textWeight?: AppTextWeight;
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onClick,
  variant = 'primary',
  loading = false,
  disabled = false,
  textVariant = 'sm',
  textWeight = 'medium',
  style,
}) => {
  const { colors } = useAppTheme();
  const isDisabled = disabled || loading;
  const styles = createStyles(colors);

  return (
    <ClickableView
      activeOpacity={0.8}
      onClick={onClick}
      disabled={isDisabled}
      style={[
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        <AppText
          variant={textVariant}
          weight={textWeight}
          tone={variant === 'primary' ? 'inverse' : 'primary'}
        >
          {title}
        </AppText>

        {loading && (
          <View style={styles.loader}>
            <AppActivityLoader
              size="small"
              color={variant === 'primary' ? colors.white : colors.primary}
            />
          </View>
        )}
      </View>
    </ClickableView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    base: {
      marginTop: spacing.sm,
      borderRadius: 18,
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },

    content: {
      ...FlexStyle.rowCenter,
    },

    loader: {
      marginLeft: spacing.sm,
    },

    primary: {
      backgroundColor: colors.primary,
    },

    secondary: {
      borderWidth: 2,
      borderColor: colors.primary,
    },

    disabled: {
      opacity: 0.6,
    },
  });

export default AppButton;

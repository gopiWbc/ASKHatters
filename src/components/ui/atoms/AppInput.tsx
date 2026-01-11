import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  TextInputProps,
  TextStyle,
  StyleProp,
  Modal,
} from 'react-native';
import AppIcon from './AppIcon';
import AppText from '../atoms/AppText';
import { useAppTheme } from '@/theme/ThemeProvider';
import { FlexStyle, spacing, typography } from '@/theme';
import { AppTextVariant, AppTextWeight, AppTextTone } from './AppText';

type AppInputType = 'input' | 'password' | 'select';

interface SelectOption {
  label: string;
  value: string;
}

interface AppInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  type?: AppInputType;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  disabled?: boolean;
  errorMessage?: string;
  note?: string;
  variant?: AppTextVariant;
  weight?: AppTextWeight;
  tone?: AppTextTone;
  style?: StyleProp<TextStyle>;

  options?: SelectOption[];
  value?: string;
  onChangeValue?: (value: string) => void;
}

const AppInput: React.FC<AppInputProps> = ({
  label,
  type = 'input',
  prefix,
  suffix,
  disabled,
  errorMessage,
  note,
  variant = 'sm',
  weight = 'regular',
  tone = 'default',
  style,
  options,
  value,
  onChangeValue,
  ...props
}) => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [showPassword, setShowPassword] = useState(false);
  const [selectVisible, setSelectVisible] = useState(false);

  const isPassword = type === 'password';
  const isSelect = type === 'select';


  return (
    <View style={styles.container}>
      {label && (
        <AppText
          variant={variant}
          weight={weight}
          tone={value ? tone : 'muted'}
        >
          {options?.find(o => o.value === value)?.label || props.placeholder}
        </AppText>
      )}

      <View
        style={[
          styles.inputWrapper,
          disabled && styles.disabled,
          errorMessage && styles.errorBorder,
        ]}
      >
        {prefix && <View style={styles.prefixIcon}>{prefix}</View>}

        <TextInput
          {...props}
          value={isSelect ? (options?.find((o) => o.value === value)?.label ?? value) : value}
          editable={!disabled && !isSelect}
          secureTextEntry={isPassword && !showPassword}
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.primary}
          style={[
            styles.input,
            {
              fontSize: typography.fontSizes[variant],
              fontFamily: typography.fontFamily[weight],
              color: toneColor(tone, colors),
            },
            style,
          ]}
        />

        {isSelect && !disabled && (
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setSelectVisible(true)}
          />
        )}

        {isPassword ? (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.suffixIcon}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <AppIcon
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        ) : (
          suffix && <View style={styles.suffixIcon}>{suffix}</View>
        )}

        {isSelect && (
          <Modal visible={selectVisible} transparent animationType="fade">
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setSelectVisible(false)}
            >
              <View style={styles.modalContent}>
                {options?.map(option => (
                  <Pressable
                    key={option.value}
                    style={styles.option}
                    onPress={() => {
                      onChangeValue?.(option.value);
                      setSelectVisible(false);
                    }}
                  >
                    <AppText>{option.label}</AppText>
                  </Pressable>
                ))}
              </View>
            </Pressable>
          </Modal>
        )}

      </View>

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

const toneColor = (tone: AppTextTone, colors: any) => {
  switch (tone) {
    case 'primary':
      return colors.primary;
    case 'secondary':
      return colors.textSecondary;
    case 'muted':
      return colors.textTertiary;
    default:
      return colors.text;
  }
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      gap: spacing.xs,
    },
    label: {
      color: colors.textSecondary,
    },
    inputWrapper: {
      ...FlexStyle.rowCenter,
      borderRadius: 14,
      paddingHorizontal: 16,
      backgroundColor: colors.inputBackground,
    },
    input: {
      ...FlexStyle.container,
      paddingVertical: 10,
      color: colors.text,
    },
    prefixIcon: {
      marginRight: spacing.sm,
    },
    suffixIcon: {
      marginLeft: spacing.sm,
    },
    disabled: {
      opacity: 0.4,
    },
    errorBorder: {
      borderWidth: 2,
      borderColor: colors.error,
    },
    message: {
      marginTop: 2,
    },
    selectInput: {
      ...FlexStyle.container,
      paddingVertical: 12,
      justifyContent: 'center',
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      padding: 20,
    },

    modalContent: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: spacing.md,
    },

    option: {
      paddingVertical: spacing.sm,
    },
    selectField: {
      ...FlexStyle.rowCenter,
      ...FlexStyle.container,
      justifyContent: 'space-between',
      paddingVertical: 12,
    },

  });



export default AppInput;

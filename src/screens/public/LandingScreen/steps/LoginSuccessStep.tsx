import AppText from '@/components/ui/atoms/AppText';
import { spacing, FlexStyle } from '@/theme';
import { ThemeColors } from '@/theme/colors';
import { useAppTheme } from '@/theme/ThemeProvider';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppIcon from '@/components/ui/atoms/AppIcon';
import AppButton from '@/components/ui/atoms/AppButton';
import ClickableView from '@/components/ui/atoms/ClickableOpacity';
import { ScreenNames } from '@/navigation/Screens';
import { useAppNavigation } from '@/navigation/useNavigation';
import LandingTopSection from '../components/LandingTopSection';
import { ContinueStep, LandingSteps } from '../utils';
import { useGetCurrentUserQuery } from '@/services/api';
// import AuthBackground from '../components/AuthBackground';

type Props = {
  activeStepIndex: number,
  moveToStep: (step: ContinueStep) => void
};

const LoginSuccessStep = ({ activeStepIndex, moveToStep }: Props) => {
  const { colors } = useAppTheme();
  const navigation = useAppNavigation();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { data: user, isLoading } = useGetCurrentUserQuery();

  const handleStart = () => {
    const roles = user?.roles || [];
    const isSupport = roles.includes('support') || roles.includes('supporter') || roles.includes('admin');
    console.log('isSupport', isSupport, user);
    navigation.reset({
      index: 0,
      routes: [{ name: isSupport ? ScreenNames.SupporterDashboard : ScreenNames.UserChat }],
    });
  };

  return (
    <View style={styles.container}>
      <LandingTopSection activeStepIndex={activeStepIndex} onBackClick={() => moveToStep(LandingSteps.Login)} />
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <AppIcon
            name="shield-check"
            size={160}
            color={colors.success}
            family="MaterialCommunityIcons"
          />
        </View>
        <AppText variant="md" weight="bold" align="center">
          Login Successful!
        </AppText>
        <AppText variant="sm" tone="secondary" align="center" style={{ marginTop: 8, marginBottom: 24 }}>
          You have successfully signed in. You can now access all features and chat with our support team.
        </AppText>
        <AppButton
          title={'Start Chatting'}
          onClick={handleStart}
          disabled={isLoading}
        />
      </View>
    </View>
  );
};
const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      ...FlexStyle.container
    },
    contentContainer: {
      ...FlexStyle.flexgrow,
      ...FlexStyle.colJustifyCenter,
      gap: spacing.sm,
    },
    iconContainer: {
      ...FlexStyle.colCenter,
      marginBottom: spacing.sm,
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    linkButton: {
      marginTop: spacing.sm,
      ...FlexStyle.colCenter,
    },
  });

export default LoginSuccessStep;

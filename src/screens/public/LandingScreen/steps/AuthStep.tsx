import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import AppText from '@/components/ui/atoms/AppText';
import ImageWithRetry from '@/components/ui/molecules/ImageWithRetry';
import AppMultiToggle from '@/components/ui/atoms/AppMultiToggle';
import { AppImage } from '@/constants/images';
import { FlexStyle, spacing } from '@/theme';
import { ThemeColors } from '@/theme/colors';
import { useAppTheme } from '@/theme/ThemeProvider';
import LoginForm from '../components/LoginForm';
import LandingTopSection from '../components/LandingTopSection';
import { AuthToggleOptions, ContinueStep, LandingSteps } from '../utils';
import RegisterForm from '../components/RegisterForm';
import ClickableView from '@/components/ui/atoms/ClickableOpacity';
import AuthBackground from '../components/AuthBackground';

type Props = {
  moveToStep: (step: ContinueStep) => void;
  activeStepIndex: number;
};

const AuthStep: React.FC<Props> = ({ moveToStep, activeStepIndex }) => {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [isSignup, setIsSignup] = useState(false);

  return (
    <View style={FlexStyle.container} >
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <LandingTopSection activeStepIndex={activeStepIndex} onBackClick={()=>moveToStep(LandingSteps.Landing)}  />

      <ImageWithRetry
        source={AppImage.lutonLogo}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.textContainer}>
        <AppText variant="xl" weight="semibold" align="center">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </AppText>
        <AppText variant="sm" tone="secondary" align="center">
          {isSignup
           ? "Sign up to follow the Hatters — get the latest Luton Town news, match updates, and exclusive content as we chase glory on the pitch."
    : "Sign in to access your Luton Town account, manage your preferences, view match info, and stay connected with everything happening at Kenilworth Road."}
        </AppText>
      </View>

      <View style={styles.contentContainer}>
        <AppMultiToggle
          options={AuthToggleOptions}
          selectedValue={isSignup ? 'register' : 'login'}
          onValueChange={v => setIsSignup(v === 'register')}
          activeColor={colors.primaryLight}
          activeTextColor={colors.primary}
        />

        {isSignup ? (
          <RegisterForm moveToStep={moveToStep} />
        ) : (
          <LoginForm moveToStep={moveToStep} />
        )}
      </View>
      <ClickableView style={styles.linkButton} onClick={()=>setIsSignup(!isSignup)}>
            <AppText variant="sm" tone="secondary">
              {isSignup 
                ? 'Already have an account? Sign In!' 
                : 'New to ASK HATTERS? Register Now!'
              }
            </AppText>
          </ClickableView>
    </ScrollView>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    scrollContent: {
      ...FlexStyle.container,
      flexGrow: 1,
    },
    logo: {
      width: 160,
      height: 70,
      alignSelf: 'center',
    },
    textContainer: {
      gap: spacing.sm,
      marginVertical: spacing.md,
      alignItems: 'center',
    },
    contentContainer: {
      ...FlexStyle.container,
      paddingVertical: spacing.md,
    },
    linkButton: {
      marginTop: spacing.sm,
      ...FlexStyle.colCenter,
    },
  });

export default AuthStep;

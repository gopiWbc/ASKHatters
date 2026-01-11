import { StyleSheet, View } from 'react-native';
import React, { useMemo, useState } from 'react';
import { FlexStyle } from '@/theme';
import LandingStep from './steps/LandingStep';
import LoginSuccessStep from './steps/LoginSuccessStep';
import { ThemeColors } from '@/theme/colors';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useSwipe } from '@/hooks/useSwipe';
import { LandingSteps, stepOrder, ContinueStep } from './utils';
import AuthStep from './steps/AuthStep';
import AuthBackground from './components/AuthBackground';
import { useGetCurrentUserQuery } from '@/services/api';


const LandingScreen = () => {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const moveToStep = (step: ContinueStep) => {
    const stepIndex = stepOrder.indexOf(step);
    if (stepIndex !== -1) {
      setActiveStepIndex(stepIndex);
    }
  };
  const renderStep = () => {
    switch (stepOrder[activeStepIndex]) {
      case LandingSteps.Landing:
        return <LandingStep activeStepIndex={activeStepIndex} moveToStep={moveToStep} />;
      case LandingSteps.Login:
        return <AuthStep activeStepIndex={activeStepIndex} moveToStep={moveToStep} />;
      case LandingSteps.Success:
        return <LoginSuccessStep activeStepIndex={activeStepIndex} moveToStep={moveToStep} />;
      default:
        return null;
    }
  };

  const { data: user } = useGetCurrentUserQuery();
  const isAuthenticated = !!user;

  const goNext = () => setActiveStepIndex(prev => {
    const nextIndex = prev + 1;
    if (nextIndex >= stepOrder.length) return prev;
    
    const nextStep = stepOrder[nextIndex];
    if (nextStep === LandingSteps.Success && !isAuthenticated) {
      return prev;
    }
    return nextIndex;
  });

  const goPrev = () => setActiveStepIndex(prev => Math.max(prev - 1, 0));
  const swipe = useSwipe({ onSwipeLeft: () => goNext(), onSwipeRight: () => goPrev() });

  return (
      <View style={styles.container} {...swipe.panHandlers}>
        <AuthBackground />
          {renderStep()}
      </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      ...FlexStyle.container,
      backgroundColor: colors.background,
      padding: 20,
      gap: 24,
    },
  });

export default LandingScreen;

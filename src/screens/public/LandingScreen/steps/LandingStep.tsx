import React, { useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import AppText from '@/components/ui/atoms/AppText';
import { AppImage } from '@/constants/images';
import ImageWithRetry from '@/components/ui/molecules/ImageWithRetry';
import { useViewport, Viewport } from '@/hooks/useViewPort';
import AppButton from '@/components/ui/atoms/AppButton';
import HeroSection from '../components/HeroSection';
import { spacing } from '@/theme';
import { ContinueStep, LandingSteps } from '../utils';
import LandingTopSection from '../components/LandingTopSection';

type Props = {
  moveToStep: (step: ContinueStep) => void;
  activeStepIndex:number
};

const LandingStep: React.FC<Props> = ({ moveToStep, activeStepIndex }) => {
  const viewport = useViewport();
  const styles = useMemo(() => createStyles(viewport), [viewport]);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const imageScale = useRef(new Animated.Value(0.95)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(imageScale, {
        toValue: 1,
        duration: 700,
        delay: 150,
        useNativeDriver: true,
      }),
      Animated.timing(buttonFade, {
        toValue: 1,
        duration: 500,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      {/* <LandingTopSection showBackButton={false} activeStepIndex={activeStepIndex} /> */}

      <HeroSection />

      <Animated.View
        style={{
          transform: [{ scale: imageScale }],
          opacity: fadeAnim,
        }}
      >
        <ImageWithRetry
          source={AppImage.hattersLanding}
          style={styles.landingCover}
          resizeMode="contain"
        />
      </Animated.View>

      <AppText variant="lg" weight="semibold" align="center">
        Luton Town F.C.
      </AppText>

      <AppText variant="sm" tone="secondary" align="center">
       Join the community, get instant support, and stay connected with the club's digital ecosystem.
      </AppText>

      <Animated.View style={{ opacity: buttonFade }}>
        <AppButton
          title={'Get Started'}
          onClick={() => moveToStep(LandingSteps.Login)}
        />
      </Animated.View>
    </Animated.View>
  );
};

const createStyles = (viewport: Viewport) =>
  StyleSheet.create({
    container:{
      marginTop:10,
      gap:spacing.sm
    },
    landingCover: {
      width: viewport.screenWidth,
      height: viewport.screenHeight * 0.45,
      alignSelf: 'center',
      marginTop: -25,
    },
  });

export default React.memo(LandingStep);

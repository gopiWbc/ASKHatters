import { StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import { AppImage } from '@/constants/images';
import { spacing } from '@/theme';
import { ThemeColors } from '@/theme/colors';
import { useAppTheme } from '@/theme/ThemeProvider';
import ImageWithRetry from '@/components/ui/molecules/ImageWithRetry';
import AppText from '@/components/ui/atoms/AppText';
import { useViewport, Viewport } from '@/hooks/useViewPort';

const HeroSection = () => {
  const { colors } = useAppTheme();
  const viewport = useViewport();
  const styles = useMemo(
    () => createStyles(colors, viewport),
    [colors, viewport],
  );

  return (
    <View>
      <View style={styles.heroContent}>
        <ImageWithRetry
          source={AppImage.lutonLogo}
          style={styles.logo}
          resizeMode="contain"
        />
        <AppText
          variant="sm"
          tone="default"
          weight="medium"
          align="center"
          style={styles.heroSubtitle}
        >
          ASK  HATTERS
          {/* Sri Bhagiyalakshmi Tours & Travels - Your Gateway to Unforgettable
          Journeys */}
        </AppText>
        <AppText
          variant="sm"
          tone="default"
          weight="medium"
          align="center"
          style={styles.heroSubtitle}
        >
          Official Support Platform
          {/* Sri Bhagiyalakshmi Tours & Travels - Your Gateway to Unforgettable
          Journeys */}
        </AppText>
        {/* <ImageWithRetry
          source={AppImage.lutonCoverImage}
          style={styles.landingCover}
          resizeMode="contain"
        /> */}
        <View style={styles.landingCover}/>
      </View>
    </View>
  );
};

export default React.memo(HeroSection);

const createStyles = (colors: ThemeColors, viewport: Viewport) =>
  StyleSheet.create({
    heroContent: {
      gap: spacing.xs,
    },
    logo: {
      width: 160,
      height: 70,
      alignSelf: 'center',
    },
    landingCover: {
      width: viewport.screenWidth,
      height: 40,
      alignSelf: 'center',
      marginBottom: 15,
      opacity: 0.6,
    },
    heroSubtitle: {
      lineHeight: 16,
      textAlign: 'center',
      paddingHorizontal: 10,
    },
  });

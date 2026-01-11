import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useViewport } from '@/hooks/useViewPort';
import LinearGradient from 'react-native-linear-gradient';
import { useAppTheme } from '@/theme/ThemeProvider';
import AppIcon from '@/components/ui/atoms/AppIcon';

const TravelThemeBg = () => {
  const { colors } = useAppTheme();
  const viewport = useViewport();

  return (
    <>
      {/* Base gradient background with more color */}
      <LinearGradient
        colors={[
          `${colors.primary}08`,
          colors.background,
          `${colors.primary}12`,
          colors.background,
          `${colors.primary}06`,
        ]}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative circles/blobs */}
      <View style={styles.decorativeContainer}>
              
        {/* Large circle bottom */}
        <View style={[styles.circle, {
          width: 200,
          height: 200,
          bottom: -80,
          left: -60,
          backgroundColor: `${colors.primary}10`,
        }]} />
      </View>

      <View style={styles.iconContainer}>
        <View style={[styles.iconWrapper, { 
          top: 15, 
          right: 20,
        }]}>
          <AppIcon 
            name="Sparkles" 
            family="Lucide" 
            size={20} 
            color={`${colors.primary}35`}
          />
        </View>

        <View style={[styles.iconWrapper, { 
          top: 50, 
          right: 60,
          transform: [{ rotate: '25deg' }]
        }]}>
          <AppIcon 
            name="Plane" 
            family="Lucide" 
            size={28} 
            color={`${colors.primary}28`}
          />
        </View>

        <View style={[styles.iconWrapper, { 
          top: 35, 
          left: 25 
        }]}>
          <AppIcon 
            name="MapPin" 
            family="Lucide" 
            size={22} 
            color={`${colors.primary}30`}
          />
        </View>

        {/* Middle section - Around menu items */}
        <View style={[styles.iconWrapper, { 
          top: 10, 
          left: 120 
        }]}>
          <AppIcon 
            name="MapPinned" 
            family="Lucide" 
            size={35} 
            color={`${colors.primary}18`}
          />
          </View>
        </View>

    </>
  );
};

export default TravelThemeBg;

const styles = StyleSheet.create({
  iconContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  iconWrapper: {
    position: 'absolute',
    opacity: 0.8,
  },
  decorativeContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.5,
  },
});
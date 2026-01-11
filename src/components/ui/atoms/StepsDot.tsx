import { lightColors } from '@/theme/colors';
import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';

interface StepDotsProps {
  total: number;
  activeIndex: number;
  inactiveColor?: string;
  activeColor?: string;
  style?: StyleProp<ViewStyle>;
}

const StepDots: React.FC<StepDotsProps> = ({
  total,
  activeIndex,
  inactiveColor = "rgba(97, 97, 97, 0.35)",
  activeColor = lightColors.primary,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.dotsContainer}>
        {Array.from({ length: total }).map((_, index) => {
          const isActive = index === activeIndex;

          return (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: inactiveColor },
                isActive && [styles.dotActive, { backgroundColor: activeColor }],
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
  },
  dotActive: {
    width: 24,
  },
});

export default StepDots;

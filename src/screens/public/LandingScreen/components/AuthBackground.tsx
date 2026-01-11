import { useAppTheme } from '@/theme/ThemeProvider';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const AuthBackground = () => {
  const { colors } = useAppTheme();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">

      <View
        style={{
          position: 'absolute',
          top: -220,
          left: -100,
          right: -100,
          height: 360,
          borderBottomLeftRadius: 420,
          borderBottomRightRadius: 420,
          backgroundColor: colors.primary,
          opacity: 0.06,
        }}
      />

      <View
        style={{
          position: 'absolute',
          top: -190,
          left: -80,
          right: -80,
          height: 300,
          borderBottomLeftRadius: 360,
          borderBottomRightRadius: 360,
          backgroundColor: colors.primary,
          opacity: 0.04,
        }}
      />

      {/* ===== DESTINATION ACCENT (BOTTOM) ===== */}
      <View
        style={{
          position: 'absolute',
          bottom: -220,
          right: -160,
          width: 360,
          height: 360,
          borderRadius: 180,
          backgroundColor: colors.primary,
          opacity: 0.05,
        }}
      />

      {/* ===== SECONDARY FLOATING ACCENT ===== */}
      {/* <View
        style={{
          position: 'absolute',
          bottom: 120,
          left: -90,
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: colors.primary,
          opacity: 0.035,
        }}
      /> */}
    </View>
  );
};

export default AuthBackground;

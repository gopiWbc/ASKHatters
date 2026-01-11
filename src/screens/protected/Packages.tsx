import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { theme } from '../../theme';
import AppButton from '@/components/ui/atoms/AppButton';
import AppText from '@/components/ui/atoms/AppText';

const PackagesScreen: React.FC = () => {
  console.log("PackagesScreen rendered");
  const [open, setOpen] = useState<boolean>(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        
        <AppText
          text="Home Screen"
          style={styles.title}
        />

        <AppText
          text="Welcome to your React Native app with React Query!"
          style={styles.subtitle}
        />

        <View style={styles.infoBox}>
          <AppText text="✅ Project Setup Complete" style={styles.infoTitle} />
          <AppText text="• React Native CLI" style={styles.infoText} />
          <AppText text="• TypeScript" style={styles.infoText} />
          <AppText text="• React Query (TanStack Query)" style={styles.infoText} />
          <AppText text="• Axios API Client" style={styles.infoText} />
          <AppText text="• Industry-standard folder structure" style={styles.infoText} />
        </View>

        <Pressable onPress={() => setOpen(true)}>
          <AppText text="Open Bottom Sheet"/>
        </Pressable>

        <AppButton title="Get Started" variant="primary" onClick={() => console.log('Pressed')} />

      </View>
    </ScrollView>
  );
};

export default PackagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontFamily: theme.typography.fontFamily.bold,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamily.regular,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  infoBox: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
  },
  infoTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fontFamily.semibold,
    marginBottom: theme.spacing.md,
  },
  infoText: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamily.regular,
    marginBottom: theme.spacing.xs,
  },
});

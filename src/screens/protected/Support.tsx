import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import AppText from '@/components/ui/atoms/AppText';

const SupportScreen: React.FC = () => (
  <View style={styles.container}>
    <AppText text="This is the Support page" style={styles.text} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  text: {
    fontSize: 22,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});

export default SupportScreen;

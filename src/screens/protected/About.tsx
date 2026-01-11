import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { theme } from '../../theme';
import AppText from '@/components/ui/atoms/AppText';

const AboutScreen: React.FC = () => (
  <View style={styles.container}>
    <Image
      source={{ uri: 'https://hatters.proscaler.ai/102-lutontown-crest.png' }}
      style={styles.crest}
      resizeMode="contain"
    />
    <AppText text="Luton Town" style={styles.title} />
    <AppText text="ASK HATTERS" style={styles.heading} />
    <AppText text="Official Support Platform" style={styles.subheading} />
    <View style={{ height: 16 }} />
    <AppText text="Luton Town F.C." style={styles.heading} />
    <AppText
      text="Join the community, get instant support, and stay connected with the club's digital ecosystem."
      style={styles.body}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: 24,
    gap: 6,
  },
  crest: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: '600',
  },
  heading: {
    fontSize: 22,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  subheading: {
    fontSize: 16,
    color: theme.colors.textSecondary || theme.colors.primary,
    fontWeight: '500',
  },
  body: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default AboutScreen;

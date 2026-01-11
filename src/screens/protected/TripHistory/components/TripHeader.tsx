import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppSearch from '@/components/ui/molecules/AppSearch';
import AppFilterIcon from '@/components/ui/molecules/AppFilterIcon';
import { spacing } from '@/theme';

interface TripHeaderProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onFilterPress: () => void;
}

const TripHeader: React.FC<TripHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onFilterPress,
}) => {
  return (
    <View style={styles.container}>
      <AppSearch
        placeholder="Search trips..."
        value={searchQuery}
        onChangeText={onSearchChange}
      />
      <AppFilterIcon onClick={onFilterPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    paddingTop: spacing.md,
  },
});

export default TripHeader;

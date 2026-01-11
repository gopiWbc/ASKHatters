import React, { useState, useMemo, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme';
import AppTabs, { Tab } from '@/components/ui/atoms/AppTabs';
import TripHeader from './components/TripHeader';
import TripCard from './components/TripCard';
import { mockTrips } from './utils';
import { Trip, TripStatus } from './types';
import AppBottomSheet, { AppBottomSheetRef } from '@/components/ui/organisms/AppBottomSheet';
import AppInput from '@/components/ui/atoms/AppInput';

const TripHistoryScreen: React.FC = () => {
  const { colors } = useAppTheme();
  const [activeTab, setActiveTab] = useState<TripStatus>('COMPLETED');
  const [searchQuery, setSearchQuery] = useState('');
  
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);

  const tabs: Tab[] = [
    { id: 'COMPLETED', label: 'Completed' },
    { id: 'CANCELLED', label: 'Cancelled' },
  ];

  const filteredTrips = useMemo(() => {
    return mockTrips.filter((trip) => {
      const matchesStatus = trip.status === activeTab;
      const matchesSearch = 
        trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const handleViewInvoice = (trip: Trip) => {
    console.log('View Invoice for:', trip.id);
  };

  const handleGiveFeedback = (trip: Trip) => {
    console.log('Give Feedback for:', trip.id);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TripHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterPress={() => bottomSheetRef.current?.open()}
      />
      
      <View style={styles.tabContainer}>
        <AppTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as TripStatus)}
        />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTrips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onViewInvoice={handleViewInvoice}
            onGiveFeedback={handleGiveFeedback}
          />
        ))}
        {filteredTrips.length === 0 && (
          <View style={styles.emptyContainer}>
            {/* You could add an empty state illustration/text here */}
          </View>
        )}
      </ScrollView>

      <AppBottomSheet ref={bottomSheetRef}>
        <ScrollView 
          style={styles.filterScroll} 
          contentContainerStyle={styles.filterContent}
          showsVerticalScrollIndicator={false}
        >
          <AppInput 
            label="Origin"
            placeholder="Search by origin..."
          />
          <AppInput 
            label="Destination"
            placeholder="Search by destination..."
          />
        </ScrollView>
      </AppBottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: spacing.sm,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  filterScroll: {
    maxHeight: '100%',
  },
  filterContent: {
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xxl,
  },
});

export default TripHistoryScreen;

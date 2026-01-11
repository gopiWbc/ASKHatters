import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/atoms/AppText';
import AppIcon from '@/components/ui/atoms/AppIcon';
import { useAppTheme } from '@/theme/ThemeProvider';
import { ThemeColors, ThemeMode } from '@/theme/colors';
import { spacing } from '@/theme';
import { Trip } from '../types';
import ClickableView from '@/components/ui/atoms/ClickableOpacity';

interface TripCardProps {
  trip: Trip;
  onViewInvoice?: (trip: Trip) => void;
  onGiveFeedback?: (trip: Trip) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onViewInvoice, onGiveFeedback }) => {
  const { colors, mode } = useAppTheme();
  const styles = useMemo(() => createStyles(colors, mode), [colors, mode]);

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <AppIcon
              key={star}
              name="Star"
              family="Lucide"
              size={16}
              color={star <= rating ? colors.yellow : colors.border}
            />
          ))}
        </View>
        <AppText text={rating.toFixed(1)} variant="xs" weight="medium" style={styles.textPrimary} />
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.dateBadge}>
          <AppIcon name="CalendarRange" family="Lucide" size={15} color={colors.textSecondary} />
          <AppText text={trip.date} variant="xs" style={styles.textSecondary} />
        </View>
        <View style={styles.orderBadge}>
          <AppText text={`#${trip.orderNumber}`} variant="xs" weight="medium" style={styles.textBrand} />
        </View>
      </View>

      <View style={styles.routeRow}>
        <View style={styles.locationInfo}>
          <AppText text={trip.origin} variant="sm" weight="medium" style={styles.textPrimary} />
          <AppIcon name="Milestone" family="Lucide" size={18} color={colors.primary} />
          <AppText text={trip.destination} variant="sm" weight="medium" style={styles.textPrimary} />
        </View>
        <AppText text={`₹${trip.price.toLocaleString()}`} variant="md" weight="semibold" style={styles.textPrimary} />
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.packageBadge}>
          <AppIcon name="Package" family="Lucide" size={13} color={colors.textSecondary} />
          <AppText text={trip.packageName} variant="xs" style={styles.packageText} />
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          {trip.status === 'COMPLETED' ? (
            trip.rating ? renderStars(trip.rating) : (
              <ClickableView onClick={() => onGiveFeedback?.(trip)} style={styles.feedbackButton}>
                <AppIcon name="Star" family="Lucide" size={12} color={colors.primary} />
                <AppText text="Rate Trip" variant="xs" weight="medium" style={[styles.textBrand, styles.rateTripText]} />
              </ClickableView>
            )
          ) : (
            <View style={styles.cancelledBadge}>
              <AppText text="Cancelled" variant="xs" weight="medium" style={styles.textError} />
            </View>
          )}
        </View>
        <ClickableView 
          onClick={() => onViewInvoice?.(trip)} 
          style={styles.invoiceButton}
        >
          <AppText text="Invoice" variant="xs" weight="medium" style={styles.textSecondary} />
          <AppIcon name="ArrowDownToLine" family="Lucide" size={13} color={colors.textSecondary} />
        </ClickableView>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors, mode: ThemeMode) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.sm + 2,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.md,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  orderBadge: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: -4,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  packageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  packageText: {
    color: colors.textSecondary,
    opacity: 0.8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)',
  },
  footerLeft: {
    flex: 1,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 1.5,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    // paddingHorizontal: 10,
    // paddingVertical: 2,
    // borderRadius: 6,
    // borderWidth: 1,
    // borderColor: colors.primary,
    alignSelf: 'flex-start',
  },
  rateTripText: {
    marginBottom: 2,
  },
  cancelledBadge: {
    backgroundColor: colors.error + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  invoiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  textPrimary: {
    color: colors.text,
  },
  textSecondary: {
    color: colors.textSecondary,
  },
  textBrand: {
    color: colors.primary,
  },
  textError: {
    color: colors.error,
  }
});

export default TripCard;

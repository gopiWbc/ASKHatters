import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { FlexStyle, spacing } from '../../theme';
import AppIcon, { IconFamily } from '@/components/ui/atoms/AppIcon';
import AppText from '@/components/ui/atoms/AppText';
import ClickableView from '@/components/ui/atoms/ClickableOpacity';
import { getBottomNavItems } from '@/navigation/navigationConfig';
import { getCurrentRouteName } from '@/utils/navigator';
import { useAppTheme } from '@/theme/ThemeProvider';
import { ThemeColors, ThemeMode } from '@/theme/colors';
import { ScreenNamesType } from '@/navigation/Screens';

interface BottomNavProps {
  onNavigate: (screenName: ScreenNamesType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ onNavigate }) => {
  const { colors, mode } = useAppTheme();
  const styles = useMemo(() => createStyles(colors, mode), [colors, mode]);
  const currentRoute = getCurrentRouteName();

  const bottomNavItems = getBottomNavItems();

  return (
    <View style={styles.navBar}>
      {bottomNavItems.map((item) => {
        const isActive = currentRoute === item.name;
        const isCentralized = item.isCentralized;

        if (isCentralized) {
          return (
            <View key={item.name} style={styles.centralButtonWrapper}>
              <ClickableView
                onClick={() => onNavigate(item.name)}
                style={styles.centralButton}
              >
                <AppIcon
                  name={item.icon.name}
                  family={item.icon.family as IconFamily}
                  color={colors.white}
                  size={item.icon.size || 30}
                />
              </ClickableView>
              <View style={styles.labelWrapper}>
                {isActive && <View style={styles.activeDot} />}
                <AppText
                  text={item.title}
                  variant="sm"
                  weight={isActive ? 'semibold' : 'medium'}
                  style={{ color: colors.primary }}
                />
              </View>
            </View>
          );
        }

        return (
          <ClickableView
            key={item.name}
            onClick={() => onNavigate(item.name)}
            style={styles.tabButton}
          >
            <AppIcon
              name={item.icon.name}
              family={item.icon.family as IconFamily}
              color={isActive ? colors.primary : colors.textSecondary}
              size={item.icon.size || 26}
            />
            <View style={styles.labelWrapper}>
              {isActive && <View style={styles.activeDot} />}
              <AppText
                text={item.title}
                variant="sm"
                weight={isActive ? 'semibold' : 'medium'}
                style={{ color: isActive ? colors.primary : colors.textSecondary }}
              />
            </View>
          </ClickableView>
        );
      })}
    </View>
  );
};

export default BottomNav;

const createStyles = (colors: ThemeColors, mode: ThemeMode) =>
  StyleSheet.create({
    navBar: {
      ...FlexStyle.rowAround,
      backgroundColor: colors.surface,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderColor: colors.border,
      borderTopWidth: 1,
      height: 70, // Increased height
    },
    tabButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xs,
      flex: 1,
    },
    centralButtonWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    centralButton: {
      width: 60, // Increased size
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: -35,
      marginBottom: 2,
    },
    labelWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 4,
    },
    activeDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      marginTop: 4,
      backgroundColor: colors.primary,
    },
  });

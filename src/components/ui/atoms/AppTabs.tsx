import React, { useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  ScrollView,
} from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';
import { ThemeColors } from '@/theme/colors';
import AppText from '@/components/ui/atoms/AppText';
import ClickableView from './ClickableOpacity';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string; color?: string; size?: number }>;
  hideField?: boolean;
  disabled?: boolean;
}

interface AppTabProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  style?: ViewStyle;
  variant?: "bottomline" | "pill";
}

const AppTabs: React.FC<AppTabProps> = ({
  tabs,
  activeTab,
  onTabChange,
  style,
  variant = "bottomline",
}) => {
  const { colors } = useAppTheme();
  const visibleTabs = useMemo(() => tabs.filter(tab => !tab.hideField), [tabs]);
  
  const styles = useMemo(() => createStyles(colors, variant), [colors, variant]);

  useEffect(() => {
    // Ensure the active tab is not hidden or disabled
    const activeTabObj = tabs.find(tab => tab.id === activeTab);
    if (activeTabObj?.hideField || activeTabObj?.disabled) {
      const firstVisibleTab = tabs.find(tab => !tab.hideField && !tab.disabled);
      if (firstVisibleTab) {
        onTabChange(firstVisibleTab.id);
      }
    }
  }, [tabs, activeTab, onTabChange]);

  const handleTabPress = (tab: Tab) => {
    if (!tab.disabled && tab.id !== activeTab) {
      onTabChange(tab.id);
    }
  };

  const renderTab = (tab: Tab) => {
    const isActive = tab.id === activeTab;
    const Icon = tab.icon;
    const isDisabled = tab.disabled;

    return (
      <ClickableView
        key={tab.id}
        style={[
          styles.tabButton,
          isActive && styles.activeTabButton,
          isDisabled && styles.disabledTabButton,
        ]}
        onClick={() => handleTabPress(tab)}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        <View style={styles.tabContent}>
          {Icon && (
            <Icon 
              size={18} 
              color={isDisabled ? colors.textTertiary : isActive ? (variant === 'pill' ? colors.white : colors.primary) : colors.textSecondary} 
            />
          )}
          <AppText
            text={tab.label}
            variant="sm"
            weight={'medium'}
            style={{
              color: isDisabled 
                ? colors.textTertiary 
                : isActive 
                  ? (variant === 'pill' ? colors.white : colors.primary) 
                  : colors.textSecondary,
            }}
          />
        </View>
        {variant === 'bottomline' && isActive && (
          <View style={styles.activeLine} />
        )}
      </ClickableView>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {visibleTabs.map(renderTab)}
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: ThemeColors, variant: "bottomline" | "pill") =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 0,
      gap: variant === 'pill' ? 8 : 16,
      ...(variant === 'bottomline' ? { borderBottomWidth: 1, borderBottomColor: colors.border } : {}),
    },
    tabButton: {
      paddingVertical: 4,
      paddingHorizontal: variant === 'pill' ? 16 : 4,
      borderRadius: variant === 'pill' ? 20 : 0,
      backgroundColor: variant === 'pill' ? colors.backgroundSecondary : 'transparent',
      ...(variant === 'pill' ? { borderWidth: 1, borderColor: colors.border } : {}),
      minWidth: 80,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    activeTabButton: {
      backgroundColor: variant === 'pill' ? colors.primary : 'transparent',
      borderColor: variant === 'pill' ? colors.primary : 'transparent',
    },
    disabledTabButton: {
      opacity: 0.5,
    },
    tabContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    activeLine: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 2.5,
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
  });

export default AppTabs;

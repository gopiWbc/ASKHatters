import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { FlexStyle, shadows, spacing } from '../../../theme';
import AppText from '@/components/ui/atoms/AppText';
import ImageWithRetry from '@/components/ui/molecules/ImageWithRetry';
import { AppImage } from '@/constants/images';
import MenuList from './MenuList';
import { useAppTheme } from '@/theme/ThemeProvider';
import { ThemeColors } from '@/theme/colors';
import { ScreenNames, ScreenNamesType } from '@/navigation/Screens';
import { getSideNavItems, NavigationItem } from '@/navigation/navigationConfig';
import { UserRoles } from '@/config/roles';
import { useViewport, Viewport } from '@/hooks/useViewPort';
import AppButton from '@/components/ui/atoms/AppButton';
import AppIcon, { IconFamily } from '@/components/ui/atoms/AppIcon';

import TravelThemeBg from './TravelThemeBg';
import { useSwipe } from '@/hooks/useSwipe';
import { useAppNavigation } from '@/navigation/useNavigation';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { useGetCurrentUserQuery, useLogoutMutation, authApi, chatApi } from '@/services/api';
import { useDispatch } from 'react-redux';

interface SidebarProps {
  navigation: {
    navigate: (screenName: any, params?: any) => void;
    toggleDrawer: () => void;
  };
}

const SideBar: React.FC<SidebarProps> = ({ navigation }) => {
  const { data: currentUser } = useGetCurrentUserQuery();
  const email = (currentUser as any)?.email || 'user@example.com';
  const userName =
    (currentUser as any)?.name ||
    (currentUser as any)?.full_name ||
    (currentUser as any)?.username ||
    'User';
  const userRole = UserRoles.Customer;
  const swipe = useSwipe({onSwipeLeft:()=>navigation.toggleDrawer()})
  const navigations = useAppNavigation();
  const { colors } = useAppTheme();
  const viewport = useViewport()

  const styles = useMemo(() => createStyles(colors,viewport), [colors,viewport]);
  const roles: string[] = (currentUser as any)?.roles || [];
  const isSupport = roles.includes('support') || roles.includes('supporter') || roles.includes('admin');

  const sideNavItems = useMemo(() => {
    const base = getSideNavItems();
    if (!isSupport) return base;
    const filtered = base.filter((item) => item.name !== ScreenNames.Enquiry);
    const supportItem: NavigationItem = {
      name: ScreenNames.SupporterDashboard as ScreenNamesType,
      title: 'Queries',
      icon: { name: 'ClipboardList', family: 'Lucide' as IconFamily, size: 26 },
    };

    return [supportItem, ...filtered];
  }, [isSupport]);

  const onSubMenuPress = (link: string) => {
    navigation.navigate(link);
  };

  const dispatch = useDispatch();

  const logout = async () => {
    console.log('=== LOGOUT ===');
    // 1. Clear tokens from storage
    await storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    await storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    
    // 2. Reset all API caches to clear user data
    dispatch(authApi.util.resetApiState());
    dispatch(chatApi.util.resetApiState());
    
    console.log('Tokens cleared, API cache reset');
    
    // 3. Navigate to landing screen
    navigations.reset({
      index: 0,
      routes: [{ name: ScreenNames.Landing }],
    });
    navigation.toggleDrawer();
  }

  return (
    <View style={styles.container} {...swipe.panHandlers}>
      <View style={styles.header}>
        <TravelThemeBg />
        <View style={styles.profileContainer}>
          <View style={styles.profileImageWrapper}>
            <View style={styles.profileImageBorder}>
              <ImageWithRetry source={AppImage.Profile} style={styles.logo} />
              <View style={styles.onlineIndicator} />
            </View>
          </View>
          <TouchableOpacity
            style={styles.userInfo}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(ScreenNames.Profile)}
          >
            <AppText
              text={userName}
              weight="semibold"
              variant="md"
              tone='primary'
            />
            <AppText 
              text={email} 
              weight="regular" 
              variant="sm" 
              tone="secondary"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu List */}
      <ScrollView 
        contentContainerStyle={styles.menuScroll}
        showsVerticalScrollIndicator={false}
      >
        {sideNavItems.map((item) => {
          return (
            <MenuList
              key={item.name}
              menu={item}
              iconName={item.icon?.name || ''}
              iconFamily={item.icon?.family || 'Lucide'}
              iconSize={item.icon?.size}
              onMenuPress={() => navigation.navigate(item.name)}
              onSubMenuPress={onSubMenuPress}
              text={item.title}
              routeName={item.name}
              userRole={userRole}
            />
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <AppButton 
          title='Log Out' 
          variant='primary' 
          onClick={logout} 
          style={styles.logOutButton}
        />
       <View style={styles.footerBrand}>
          <AppIcon name="information" size={16} color={colors.primary} family="MaterialCommunityIcons" />
          <AppText 
            text="Official Support Platform" 
            variant="xs" 
            tone="secondary" 
            weight="medium"
          />
        </View>
      </View>
    </View>
  );
};

export default SideBar;

const createStyles = (colors: ThemeColors, viewport: Viewport) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: viewport.screenWidth * 0.7,
  },
  header: {
    width: '100%',
    height: viewport.screenHeight * 0.14,
    backgroundColor: colors.background,
    position: 'relative',
    overflow: 'hidden',
  },
  profileContainer: {
    ...FlexStyle.rowStart,
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
    zIndex: 1,
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImageBorder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: colors.primary,
    padding: 2,
    backgroundColor: colors.background,
    ...shadows.e3,
    position: 'relative',
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    resizeMode: 'cover',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.background,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  memberBadge: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: `${colors.primary}15`,
  },
  memberBadgeText: {
    color: colors.primary,
    fontSize: 11,
  },
  menuScroll: {
    flexGrow: 1,
    padding: spacing.sm,
  },
  footer: {
    ...FlexStyle.colCenter,
    width: '100%',
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: spacing.xs,
  },
  logOutButton: {
    paddingHorizontal:spacing.xxxl,
    borderRadius: 24,
    paddingVertical: 6,
  },
  footerBrand: {
    ...FlexStyle.rowCenter,
    gap: 6,
    marginTop: spacing.sm,
  },
});
import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Platform,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CustomHeader from '../templates/CustomHeader';
import Sidebar from '../templates/Sidebar/Sidebar';
import BottomNav from '../templates/BottomNav';

import { useAppTheme } from '@/theme/ThemeProvider';
import { ThemeColors } from '@/theme/colors';
import { ScreenNamesType } from '@/navigation/Screens';
import { useAppNavigation } from '@/navigation/useNavigation';
import { useViewport, Viewport } from '@/hooks/useViewPort';
import { FlexStyle } from '@/theme';


interface AppLayoutProps {
  children: React.ReactNode;
  screenTitle?: string;
  showBottomNav?: boolean;
  showHeader?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  screenTitle,
  showBottomNav = true,
  showHeader = true,
}) => {
  const { colors } = useAppTheme();
  const viewport = useViewport()
  const SIDEBAR_WIDTH = viewport.screenWidth * 0.7;
  
  
  const styles = useMemo(() => createStyles(colors,viewport), [colors,viewport]);
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const slideAnim = useMemo(() => new Animated.Value(-SIDEBAR_WIDTH), []);
  const backdropOpacity = useMemo(() => new Animated.Value(0), []);

  const openSidebar = () => {
    setIsSidebarOpen(true);
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0.5,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSidebar = () => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: -SIDEBAR_WIDTH,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setIsSidebarOpen(false));
  };

  const toggleSidebar = () => {
    isSidebarOpen ? closeSidebar() : openSidebar();
  };

  const handleNavigate = (screenName: ScreenNamesType) => {
    closeSidebar();
    navigation.navigate(screenName as any);
  };

  /* Android back button */
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isSidebarOpen) {
          closeSidebar();
          return true;
        }
        return false;
      },
    );
    return () => backHandler.remove();
  }, [isSidebarOpen]);

  return (
    <View style={[styles.container]}>
      {/* Header */}
     { showHeader && <CustomHeader
        navigation={{ toggleDrawer: toggleSidebar }}
        screenTitle={screenTitle}
      />}

      {/* Main Content */}
      <View style={styles.content}>{children}</View>

      {/* Bottom Navigation */}
      {/* {showBottomNav && (
        <View style={{ paddingBottom: insets.bottom }}>
          <BottomNav onNavigate={handleNavigate} />
        </View>
      )} */}

      {/* Overlay */}
      {isSidebarOpen && (
        <View
          style={[
            styles.overlay,
            { paddingBottom: insets.bottom },
          ]}
          pointerEvents="box-none"
        >
          {/* Backdrop */}
          <TouchableWithoutFeedback onPress={closeSidebar}>
            <Animated.View
              style={[
                styles.backdrop,
                { opacity: backdropOpacity },
              ]}
            />
          </TouchableWithoutFeedback>

          {/* Sidebar */}
          <Animated.View
            style={[
              styles.sidebar,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <Sidebar
              navigation={{
                navigate: handleNavigate,
                toggleDrawer: toggleSidebar,
              }}
            />
          </Animated.View>
        </View>
      )}
    </View>
  );
};

export default AppLayout;

/* ================= STYLES ================= */
const createStyles = (colors: ThemeColors,viewport:Viewport) => StyleSheet.create({
    container: {
      ...FlexStyle.container,
      backgroundColor:colors.background
    },
    content: {
      ...FlexStyle.container,
      backgroundColor:colors.background
    },

    overlay: {
      ...StyleSheet.absoluteFill,
      zIndex: 1000,
    },

    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },

    sidebar: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: viewport.screenWidth*0.7,
      backgroundColor: colors.background,
      zIndex: 1001,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 16,
        },
      }),
    },
  });

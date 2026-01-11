import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView, initialWindowMetrics, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Toast from 'react-native-toast-message';
import toastConfig from './src/components/templates/toastConfig';
import NetInfo from '@react-native-community/netinfo';
import { ToastProvider } from 'react-native-toast-notifications';
import React, { useEffect, useMemo, useRef } from 'react';
import BootSplash from 'react-native-bootsplash';
import CustomToastRenderType from './src/components/templates/CustomToaster';
import { RootNavigator } from './src/navigation/RootNavigator';
import * as Sentry from '@sentry/react-native';
import { AppThemeProvider, useAppTheme } from './src/theme/ThemeProvider';
import type { ThemeColors } from './src/theme/colors';
import { Provider } from 'react-redux';
import { store } from './src/store';

// Sentry.init({
//   dsn: 'https://1f3ba5896694aabf4c761cf27c103b9d@o4510457850560512.ingest.us.sentry.io/4510457850757120',
//   enableNative: false,
//   tracesSampleRate: 1.0,
//   _experiments: {
//     profilesSampleRate: 1.0,
//   },
// });

const NetworkListener = () => {
  const previousConnectionStatus = useRef<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const isConnected = state.isInternetReachable;

      if (!isConnected) {
        Toast.show({
          type: 'tomatoToast',
          props: {
            status: 'error',
            message: 'No Internet Connection',
          },
          position: 'top',
        });
        previousConnectionStatus.current = true;
      } else if (previousConnectionStatus.current && isConnected) {
        Toast.show({
          type: 'tomatoToast',
          props: {
            status: 'success',
            message: 'Connected',
          },
          position: 'top',
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
};

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    statusBarSpacer: {
      backgroundColor: theme.background,
    },
    appContainer: {
      flex: 1,
      backgroundColor: theme.backgroundSecondary,
    },
  });

const AppShell = () => {
  const insets = useSafeAreaInsets();
  const { colors, mode } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const statusBarStyle = mode === 'dark' ? 'light-content' : 'dark-content';

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={statusBarStyle}
      />
      <View style={[styles.statusBarSpacer, { height: insets.top }]} />
      <View style={styles.appContainer}>
        {/* react-native-toast-notifications */}
        <ToastProvider renderType={CustomToastRenderType} placement="top">
          <RootNavigator />
        </ToastProvider>
        {/* react-native-toast-message */}
        <NetworkListener />
        <Toast config={toastConfig} visibilityTime={3000} autoHide={true} />
      </View>
    </SafeAreaView>
  );
};



const App = () => {
  useEffect(() => {
    BootSplash.hide({ fade: true });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <AppThemeProvider>
            <AppShell />
          </AppThemeProvider>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>

  );
}

export default App;

import React, { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef, getCurrentRouteName } from '../utils/navigator';
import Toast from 'react-native-toast-message';
import toastConfig from '../components/templates/toastConfig';
import { StackScreens } from './navigationConfig';
import { AppParamList, ScreenNames, routeDisplayNameMap } from './Screens';
import AppLayout from '@/components/layouts/AppLayout';


const Stack = createNativeStackNavigator<AppParamList>();


const NO_LAYOUT_SCREENS: string[] = [ScreenNames.Landing, ScreenNames.Logout];

import { useGetCurrentUserQuery } from '@/services/api';
import { ActivityIndicator, View } from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';


export const RootNavigator: React.FC = () => {
    const [currentRoute, setCurrentRoute] = React.useState<string | undefined>(ScreenNames.Landing);
    const { colors } = useAppTheme();

    // Check auth state
    const { data: user, isLoading, isError } = useGetCurrentUserQuery();
    const isAuthenticated = !!user;

    const onStateChange = React.useCallback(() => {
        const routeName = getCurrentRouteName();
        setCurrentRoute(routeName);
    }, []);

    const userRoles = user?.roles || [];
    const screenTitle = currentRoute ? routeDisplayNameMap[currentRoute] : '';
    // Hide header/nav ONLY on Landing and Logout screens
    const showHeaderAndNav = currentRoute ? !NO_LAYOUT_SCREENS.includes(currentRoute) : true;

    useEffect(() => {
        if (!isLoading && !isAuthenticated && currentRoute !== ScreenNames.Landing) {
            navigationRef.reset({
                index: 0,
                routes: [{ name: ScreenNames.Landing }],
            });
        }
        // Removed the "else if" that automatically navigates to Dashboard when isAuthenticated
        // to allow the Landing screen's Success step to be shown.
    }, [isLoading, isAuthenticated]);

    // Decide which initial route to show once we know the auth state
    const getInitialRoute = () => {
        if (!isAuthenticated) return ScreenNames.Landing;
        if (user?.roles.includes('support') || user?.roles.includes('supporter') || user?.roles.includes('admin')) {
            return ScreenNames.SupporterDashboard;
        }
        return ScreenNames.UserChat;
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer
            ref={navigationRef}
            onStateChange={onStateChange}
            onReady={() => {
                const routeName = getCurrentRouteName();
                setCurrentRoute(routeName);
            }}
        >
            <AppLayout
                screenTitle={screenTitle}
                showHeader={showHeaderAndNav}
                showBottomNav={showHeaderAndNav}
            >
                <Stack.Navigator
                    initialRouteName={getInitialRoute()}
                    screenOptions={{
                        headerShown: false,
                    }}>
                    {StackScreens
                        .map(screen => (
                            <Stack.Screen
                                key={screen.name}
                                name={screen.name as keyof AppParamList}
                                component={screen.component}
                                options={{
                                    headerShown: false,
                                    animation: "simple_push",
                                }}
                            />
                        ))}
                </Stack.Navigator>
            </AppLayout>
            <Toast config={toastConfig} visibilityTime={3000} autoHide={true} />
        </NavigationContainer>
    );
};

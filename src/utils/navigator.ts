import { createNavigationContainerRef, StackActions } from '@react-navigation/native';
import type { AppParamList } from '@/navigation/Screens';

export const navigationRef = createNavigationContainerRef<AppParamList>();

/**
 * Safe navigate function (can be used anywhere)
 */
export function navigate<T extends Extract<keyof AppParamList, string>>(
  name: T,
  params?: AppParamList[T]
) {
  if (navigationRef.isReady()) {
    (navigationRef.navigate as any)(name, params);
  }
}

/**
 * Replace current route
 */
export function replace<T extends Extract<keyof AppParamList, string>>(
  name: T,
  params?: AppParamList[T]
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(name, params));
  }
}

/**
 * Push new route
 */
export function push<T extends Extract<keyof AppParamList, string>>(
  name: T,
  params?: AppParamList[T]
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(name, params));
  }
}

/**
 * Reset navigation stack
 */
export function reset<T extends Extract<keyof AppParamList, string>>(
  name: T,
  params?: AppParamList[T]
) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: name as string, params }],
    });
  }
}

/**
 * Go back safely
 */
export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

/**
 * Get current route name
 */
export const getCurrentRouteName = (): keyof AppParamList | undefined => {
  return navigationRef.getCurrentRoute()?.name as keyof AppParamList | undefined;
};

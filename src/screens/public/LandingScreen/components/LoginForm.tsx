import React, { useState } from 'react';
import { authApi } from '@/services/api';
import { StyleSheet, View } from 'react-native';
import AppInput from '@/components/ui/atoms/AppInput';
import AppIcon from '@/components/ui/atoms/AppIcon';
import AppToggle from '@/components/ui/atoms/AppToggle';
import AppText from '@/components/ui/atoms/AppText';
import AppButton from '@/components/ui/atoms/AppButton';
import ClickableView from '@/components/ui/atoms/ClickableOpacity';
import { FlexStyle, spacing } from '@/theme';
import { useAppTheme } from '@/theme/ThemeProvider';
import { ContinueStep, LandingSteps } from '../utils';

import { useLoginMutation, useGetCurrentUserQuery } from '@/services/api';
import { storage, STORAGE_KEYS } from '@/utils';
import { useToast } from 'react-native-toast-notifications';

import { useAppNavigation } from '@/navigation/useNavigation';
import { ScreenNames } from '@/navigation/Screens';

type Props = {
  moveToStep: (step: ContinueStep) => void;
};

const LoginForm: React.FC<Props> = ({ moveToStep }) => {
  const { colors } = useAppTheme();
  const toast = useToast();
  const navigation = useAppNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  // Fetch user details *after* login to ensure token is applied
  const [fetchCurrentUser] = authApi.endpoints.getCurrentUser.useLazyQuery();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        toast.show('Please fill in all fields', { type: 'danger' });
        return;
      }
      console.log('email', email);
      console.log('password', password);
      const response = await login({ email, password }).unwrap();
      console.log('response', response);
      // Store tokens - this will trigger RootNavigator re-fetch due to tag invalidation in authApi
      await storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token);
      await storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token);

      // Immediately refetch current user with the new token passed directly
      // This avoids race condition with AsyncStorage
      await fetchCurrentUser(response.access_token).unwrap();

      toast.show('Login successful', { type: 'success' });

      moveToStep(LandingSteps.Success);
      
    } catch (error: any) {
      console.error('Login error:', error);
      const msg = error?.data?.detail?.[0]?.msg || error?.data?.detail || 'Login failed';
      toast.show(msg, { type: 'danger' });
    }
  };

  return (
    <View style={styles.container}>
      <AppInput
        placeholder="EMAIL ADDRESS"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        prefix={<AppIcon name="user" size={20} color={colors.textSecondary} family="FontAwesome" />}
      />

      <AppInput
        type="password"
        placeholder="PASSWORD"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        prefix={<AppIcon name="locked" size={20} color={colors.textSecondary} family="Fontisto" />}
      />

      <View style={styles.rememberSection}>
        <AppToggle label="Remember me" value={rememberMe} onChange={setRememberMe} />
        <ClickableView onClick={() => { }}>
          <AppText variant="sm" tone="secondary">
            Forgot Password?
          </AppText>
        </ClickableView>
      </View>

      <AppButton title={isLoading ? "Signing In..." : "Sign In"} onClick={handleLogin} disabled={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    marginVertical: spacing.md,
  },
  rememberSection: {
    ...FlexStyle.rowBetween,
  },
});

export default LoginForm;

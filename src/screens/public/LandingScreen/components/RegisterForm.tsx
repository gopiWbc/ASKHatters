import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AppInput from '@/components/ui/atoms/AppInput';
import AppIcon from '@/components/ui/atoms/AppIcon';
import AppButton from '@/components/ui/atoms/AppButton';
import { spacing } from '@/theme';
import { useAppTheme } from '@/theme/ThemeProvider';
import { ContinueStep, LandingSteps } from '../utils';

type Props = {
  moveToStep: (step: ContinueStep) => void;
};

import { useRegisterMutation } from '@/services/api';
import { storage, STORAGE_KEYS } from '@/utils';
import { useToast } from 'react-native-toast-notifications';

// ... imports

const RegisterForm: React.FC<Props> = ({ moveToStep }) => {
  const { colors } = useAppTheme();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [membershipTier, setMembershipTier] = useState('');
  const [password, setPassword] = useState('');

  const [register, { isLoading }] = useRegisterMutation();

  const handleRegister = async () => {
    try {
      if (!name || !email || !password) {
        toast.show('Please fill in all required fields', { type: 'danger' });
        return;
      }

      const payload = {
        full_name: name,
        email,
        password,
        membership_tier: membershipTier || undefined,
        roles: ['user'] // Default role
      };

      const response = await register(payload).unwrap();

      // Store tokens (Backend returns tokens on register)
      await storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token);
      await storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token);

      toast.show('Registration Successful', { type: 'success' });
      moveToStep(LandingSteps.Success);

    } catch (error: any) {
      console.error('Register error:', error);
      const msg = error?.data?.detail?.[0]?.msg || error?.data?.detail || 'Registration failed';
      toast.show(msg, { type: 'danger' });
    }
  };


  return (
    <View style={styles.container}>
      <AppInput
        placeholder="FULL NAME"
        value={name}
        onChangeText={setName}
        prefix={<AppIcon name="user" size={20} color={colors.textSecondary} family="FontAwesome" />}
      />

      <AppInput
        placeholder="EMAIL ADDRESS"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        prefix={<AppIcon name="email" size={20} color={colors.textSecondary} family="Entypo" />}
      />

      <AppInput
        type="password"
        placeholder="PASSWORD"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        prefix={<AppIcon name="locked" size={20} color={colors.textSecondary} family="Fontisto" />}
      />

      <AppInput
        type="select"
        placeholder="MEMBERSHIP TIER"
        value={membershipTier}
        onChangeValue={setMembershipTier}
        options={[
          { label: 'Standard', value: 'standard' },
          { label: 'Gold', value: 'gold' },
          { label: 'Platinum', value: 'platinum' },
        ]}

        prefix={<AppIcon name="user-circle" size={20} color={colors.textSecondary} family="FontAwesome" />}
      />

      <AppButton title={isLoading ? "Creating Account..." : "Sign Up"} onClick={handleRegister} disabled={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    marginVertical: spacing.md,
  },
});

export default RegisterForm;

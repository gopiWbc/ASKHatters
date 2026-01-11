import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import AppText from '@/components/ui/atoms/AppText';
import AppButton from '@/components/ui/atoms/AppButton';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, borderRadius } from '@/theme';
import { useGetCurrentUserQuery, useUpdateUserMutation } from '@/services/api';
import { useToast } from 'react-native-toast-notifications';
import { User } from '@/types';

const ProfileScreen: React.FC = () => {
  const { colors } = useAppTheme();
  const toast = useToast();

  const { data: currentUser, isLoading: isLoadingUser, refetch } = useGetCurrentUserQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [county, setCounty] = useState('');
  const [city, setCity] = useState('');
  const [membershipTier, setMembershipTier] = useState('');

  useEffect(() => {
    if (currentUser) {
      const u = currentUser as User;
      setFullName(u.full_name || '');
      setUsername(u.username || '');
      setEmail(u.email || '');
      setCounty(u.county || '');
      setCity(u.city || '');
      setMembershipTier(u.membership_tier || '');
    }
  }, [currentUser]);

  const handleSave = async () => {
    try {
      await updateUser({
        full_name: fullName || undefined,
        username: username || undefined,
        email: email || undefined,
        county: county || undefined,
        city: city || undefined,
      }).unwrap();
      toast.show('Profile updated', { type: 'success' });
      refetch();
    } catch (err) {
      console.error('Update user failed', err);
      toast.show('Failed to update profile', { type: 'danger' });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* <AppText variant="lg" weight="bold" style={{ marginBottom: spacing.md }}>
          Profile
        </AppText> */}

        {isLoadingUser ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText style={{ marginTop: 8 }}>Loading your profile...</AppText>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.field}>
              <AppText variant="xs" style={{ color: colors.textSecondary, marginBottom: 4 }}>
                Full Name
              </AppText>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter full name"
                placeholderTextColor={colors.textTertiary}
                style={[
                  styles.input,
                  { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border },
                ]}
              />
            </View>

            <View style={styles.field}>
              <AppText variant="xs" style={{ color: colors.textSecondary, marginBottom: 4 }}>
                Username
              </AppText>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
                placeholderTextColor={colors.textTertiary}
                autoCapitalize="none"
                style={[
                  styles.input,
                  { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border },
                ]}
              />
            </View>

            <View style={styles.field}>
              <AppText variant="xs" style={{ color: colors.textSecondary, marginBottom: 4 }}>
                Email
              </AppText>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                placeholderTextColor={colors.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[
                  styles.input,
                  { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border },
                ]}
              />
            </View>

            <View style={styles.field}>
              <AppText variant="xs" style={{ color: colors.textSecondary, marginBottom: 4 }}>
                County
              </AppText>
              <TextInput
                value={county}
                onChangeText={setCounty}
                placeholder="Enter county"
                placeholderTextColor={colors.textTertiary}
                style={[
                  styles.input,
                  { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border },
                ]}
              />
            </View>

            <View style={styles.field}>
              <AppText variant="xs" style={{ color: colors.textSecondary, marginBottom: 4 }}>
                City
              </AppText>
              <TextInput
                value={city}
                onChangeText={setCity}
                placeholder="Enter city"
                placeholderTextColor={colors.textTertiary}
                style={[
                  styles.input,
                  { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border },
                ]}
              />
            </View>

            <View style={styles.field}>
              <AppText variant="xs" style={{ color: colors.textSecondary, marginBottom: 4 }}>
                Membership Tier
              </AppText>
              <TextInput
                value={membershipTier}
                editable={false}
                selectTextOnFocus={false}
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.textSecondary,
                    borderColor: colors.border,
                  },
                ]}
              />
            </View>

            <View style={{ marginTop: spacing.lg }}>
              <AppButton
                title={isUpdating ? 'Saving...' : 'Save Changes'}
                variant="primary"
                onClick={handleSave}
                disabled={isUpdating}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    gap: spacing.md,
  },
  field: {
    gap: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
  },
});

export default ProfileScreen;

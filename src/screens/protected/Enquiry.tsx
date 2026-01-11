import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { skipToken } from '@reduxjs/toolkit/query';
import AppText from '@/components/ui/atoms/AppText';
import AppIcon from '@/components/ui/atoms/AppIcon';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useGetCurrentUserQuery, useGetUserChatsQuery } from '@/services/api';
import { ChatSession } from '@/types/chat.types';
import { useAppNavigation } from '@/navigation/useNavigation';
import { ScreenNames } from '@/navigation/Screens';

const formatTime = (iso?: string | null) => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

const pickTimestamp = (chat: ChatSession) =>
  chat.last_message_at || chat.updated_at || chat.created_at;

const EnquiryScreen: React.FC = () => {
  const { colors } = useAppTheme();
  const navigation = useAppNavigation();

  const { data: currentUser } = useGetCurrentUserQuery();
  const userId = currentUser?._id || (currentUser as any)?.id;

  const {
    data: userChats = [],
    isLoading: isLoadingChats,
  } = useGetUserChatsQuery(userId ? { userId, limit: 20 } : skipToken);

  const sortedChats = useMemo(() => {
    return [...userChats].sort((a, b) => {
      const ta = pickTimestamp(a) || '';
      const tb = pickTimestamp(b) || '';
      return new Date(tb).getTime() - new Date(ta).getTime();
    });
  }, [userChats]);

  const renderHistoryItem = ({ item }: { item: ChatSession }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(ScreenNames.UserChat, { chatId: item._id, readOnly: true })
      }
      activeOpacity={0.8}
      style={[
        styles.historyItem,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={[styles.historyLeft, { backgroundColor: colors.backgroundSecondary }]}>
        <AppIcon name="MessageCircle" family="Lucide" size={18} color={colors.textSecondary} />
      </View>
      <View style={styles.historyCenter}>
        <AppText variant="sm" weight="semibold" numberOfLines={1}>
          {item.title || 'New Chat'}
        </AppText>
        <AppText variant="xs" style={{ color: colors.textSecondary }} numberOfLines={1}>
          Tap to view this chat
        </AppText>
      </View>
      <View style={styles.historyRight}>
        <AppText variant="xs" style={{ color: colors.textTertiary }}>
          {formatTime(pickTimestamp(item))}
        </AppText>
        <AppIcon name="ChevronRight" family="Lucide" size={16} color={colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {isLoadingChats ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText style={{ marginTop: 8 }}>Loading chat history...</AppText>
          </View>
        ) : (
          <>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <AppText variant="md" weight="bold">
                Recent Conversations
              </AppText>
            </View>
            <FlatList
              data={sortedChats}
              keyExtractor={(item) => item._id}
              renderItem={renderHistoryItem}
              contentContainerStyle={styles.historyList}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <View style={styles.center}>
                  <AppText>No chat history.</AppText>
                </View>
              }
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  messageList: {
    padding: 16,
    paddingBottom: 24,
  },
  historyHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyList: {
    padding: 16,
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  historyLeft: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyCenter: {
    flex: 1,
  },
  historyRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
});

export default EnquiryScreen;

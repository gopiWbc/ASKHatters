import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { skipToken } from '@reduxjs/toolkit/query';
import AppText from '@/components/ui/atoms/AppText';
import AppIcon from '@/components/ui/atoms/AppIcon';
import ChatBubble from '@/components/chat/ChatBubble';
import { useAppTheme } from '@/theme/ThemeProvider';
import {
  useGetChatMessagesQuery,
  useGetCurrentUserQuery,
  useGetUserChatsQuery,
} from '@/services/api';
import { ChatMessage, ChatSession } from '@/types/chat.types';
import { listenToMessages } from '@/services/firestoreListeners';

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

const CustomerTripScreen: React.FC = () => {
  const { colors } = useAppTheme();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);

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

  useEffect(() => {
    if (sortedChats.length > 0 && !selectedChatId) {
      const active = sortedChats.find((c) =>
        ['active', 'waiting', 'in_progress'].includes(c.status),
      );
      setSelectedChatId((active ?? sortedChats[0])._id);
    }
  }, [sortedChats, selectedChatId]);

  const {
    data: messages = [],
    isLoading: isLoadingMessages,
  } = useGetChatMessagesQuery(selectedChatId ?? skipToken);

  useEffect(() => {
    if (!selectedChatId) {
      setLiveMessages([]);
      return;
    }
    const unsub = listenToMessages(selectedChatId, (msgs) => setLiveMessages(msgs as ChatMessage[]));
    return () => unsub();
  }, [selectedChatId]);

  const displayMessages = liveMessages.length ? liveMessages : messages;

  const renderHistoryItem = ({ item }: { item: ChatSession }) => (
    <TouchableOpacity
      style={[styles.historyItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => {
        setSelectedChatId(item._id);
        setShowHistory(false);
      }}
    >
      <View style={[styles.historyLeft, { backgroundColor: colors.backgroundSecondary }]}>
        <AppIcon name="MessageCircle" family="Lucide" size={18} color={colors.textSecondary} />
      </View>
      <View style={styles.historyCenter}>
        <AppText variant="sm" weight="semibold" numberOfLines={1}>
          {item.title || 'New Chat'}
        </AppText>
        <AppText variant="xs" style={{ color: colors.textSecondary }} numberOfLines={1}>
          Click to view this chat...
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

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <ChatBubble message={item} isOwn={item.sender === 'user'} />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <AppText variant="md" weight="bold">
          Chat History
        </AppText>
        <TouchableOpacity onPress={() => setShowHistory(true)} style={styles.iconButton}>
          <AppIcon name="history" family="MaterialIcons" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {isLoadingMessages || isLoadingChats ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText style={{ marginTop: 8 }}>Loading chat...</AppText>
          </View>
        ) : selectedChatId ? (
          <FlatList
            data={displayMessages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messageList}
            ListEmptyComponent={
              <View style={styles.center}>
                <AppText style={{ color: colors.textSecondary }}>No messages yet.</AppText>
              </View>
            }
          />
        ) : (
          <View style={styles.center}>
            <AppText>Select a conversation to view messages.</AppText>
          </View>
        )}
      </View>

      <Modal
        visible={showHistory}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowHistory(false)}
      >
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={[styles.historyHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setShowHistory(false)}>
              <AppText variant="md" tone="primary">
                Close
              </AppText>
            </TouchableOpacity>
            <AppText variant="lg" weight="bold">
              Recent Conversations
            </AppText>
            <View style={{ width: 48 }} />
          </View>

          {isLoadingChats ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <FlatList
              data={sortedChats}
              keyExtractor={(item) => item._id}
              renderItem={renderHistoryItem}
              contentContainerStyle={styles.historyList}
              ListEmptyComponent={
                <View style={styles.center}>
                  <AppText>No chat history.</AppText>
                </View>
              }
            />
          )}
        </SafeAreaView>
      </Modal>
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
  iconButton: {
    padding: 6,
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

export default CustomerTripScreen;

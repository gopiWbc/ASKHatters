import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform, Image, Modal, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';
import AppText from '@/components/ui/atoms/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';
import { useCreateChatMutation, useGetChatMessagesQuery, useSendMessageMutation, useGetUserChatsQuery, useGetCurrentUserQuery, useLogoutMutation, useCloseChatMutation } from '@/services/api';
import { ChatMessage, ChatSession } from '@/types/chat.types';
import { skipToken } from '@reduxjs/toolkit/query/react';
import AppIcon from '@/components/ui/atoms/AppIcon';
import ChatListItem from '@/components/chat/ChatListItem';
import { useAppNavigation } from '@/navigation/useNavigation';
import { AppParamList, ScreenNames } from '@/navigation/Screens';
import { storage, STORAGE_KEYS } from '@/utils';
import { useToast } from 'react-native-toast-notifications';
import { listenToMessages } from '@/services/firestoreListeners';
import { useRoute, RouteProp } from '@react-navigation/native';

// Asset import
const LogoImage = require('@/assets/images/Logo.png');

const UserChatScreen = () => {
    const { colors } = useAppTheme();
    const navigation = useAppNavigation();
    const toast = useToast();
    const route = useRoute<RouteProp<AppParamList, typeof ScreenNames.UserChat>>();
    const initialChatId = route.params?.chatId || null;
    const readOnly = route.params?.readOnly || false;

    // State
    const [chatId, setChatId] = useState<string | null>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
    const [awaitingReply, setAwaitingReply] = useState(false);
    const [lastUserMessageAt, setLastUserMessageAt] = useState<number>(0);

    // APIs
    const { data: currentUser } = useGetCurrentUserQuery();
    const userId = currentUser?._id || (currentUser as any)?.id;
    const { data: userChats = [], isLoading: isLoadingChats } = useGetUserChatsQuery(
        userId ? { userId, limit: 20 } : skipToken
    );
    const [logout] = useLogoutMutation();

    const [createChat, { isLoading: isCreatingChat }] = useCreateChatMutation();
    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
    const [closeChat, { isLoading: isClosingChat }] = useCloseChatMutation();

    // Sync chatId from navigation param (e.g., from Enquiry read-only view)
    useEffect(() => {
        if (initialChatId && chatId !== initialChatId) {
            setChatId(initialChatId);
        }
    }, [initialChatId, chatId]);

    // Effect: Set active chat if exists (only on initial load or if chatId is null)
    useEffect(() => {
        if (userChats && userChats.length > 0 && !chatId) {
            const activeChat = userChats.find((c: any) => c.status === 'active' || c.status === 'in_progress' || c.status === 'waiting');
            if (activeChat) {
                setChatId(activeChat._id);
            }
        }
    }, [userChats]);

    // Query messages
    const { data: messages = [], isLoading: isLoadingMessages } = useGetChatMessagesQuery(chatId ?? skipToken);

    // Firestore listener for live messages (replaces REST polling)
    useEffect(() => {
        if (!chatId) {
            setLiveMessages([]);
            return;
        }
        const unsub = listenToMessages(chatId, (msgs) => setLiveMessages(msgs as ChatMessage[]));
        return () => unsub();
    }, [chatId]);

    const displayMessages = liveMessages.length ? liveMessages : messages;

    const handleSend = async (text: string) => {
        if (!currentUser || readOnly) return;
        try {
            const now = Date.now();
            setLastUserMessageAt(now);
            setAwaitingReply(true);
            if (chatId) {
                await sendMessage({ chat_id: chatId, text }).unwrap();
            } else {
                const newChat = await createChat({
                    message: text,
                    user_id: currentUser._id || currentUser.id || ''
                }).unwrap();
                setChatId(newChat._id);
            }
        } catch (error) {
            console.error('Failed to send message', error);
            toast.show('Failed to send message', { type: 'danger' });
            setAwaitingReply(false);
        }
    };

    // When an assistant message arrives after the last user message, clear the thinking state
    useEffect(() => {
        if (!awaitingReply || !displayMessages.length) return;

        const parseTs = (value: any) => {
            if (!value) return 0;
            if (typeof value === 'object' && 'seconds' in value) {
                return (value as { seconds: number }).seconds * 1000;
            }
            const t = new Date(value).getTime();
            return Number.isNaN(t) ? 0 : t;
        };

        const hasAssistantReply = displayMessages.some(
            (m) => m.sender === 'assistant' && parseTs(m.created_at) > lastUserMessageAt,
        );

        if (hasAssistantReply) {
            setAwaitingReply(false);
        }
    }, [awaitingReply, displayMessages, lastUserMessageAt]);

    const handleLogout = async () => {
        try {
            // Call API
            await logout().unwrap();
        } catch (e) {
            console.log('Logout API failed, clearing local', e);
        }
        // Clear tokens
        await storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        await storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

        // Reset Nav
        navigation.reset({
            index: 0,
            routes: [{ name: ScreenNames.Landing }],
        });
    };

    const handleSelectChat = (chat: ChatSession) => {
        setChatId(chat._id);
        setShowHistory(false);
    };

    const handleNewChat = () => {
        setChatId(null);
        setLiveMessages([]);
        setShowHistory(false);
    };

    // Close active chat and start fresh
    const handleCloseChat = async () => {
        if (!chatId) return;
        
        try {
            console.log('Closing chat:', chatId);
            await closeChat(chatId).unwrap();
            toast.show('Chat closed. Starting a new session...', { type: 'success' });
            
            // Reset state for new chat
            setChatId(null);
            setLiveMessages([]);
            setAwaitingReply(false);
        } catch (error) {
            console.error('Failed to close chat:', error);
            toast.show('Failed to close chat', { type: 'danger' });
        }
    };

    // Check if current chat is active (can be closed)
    const isActiveChatSession = chatId && userChats.some(
        (c: ChatSession) => c._id === chatId && (c.status === 'active' || c.status === 'in_progress' || c.status === 'waiting')
    );

    // Listen for header close button event
    useEffect(() => {
        const sub = DeviceEventEmitter.addListener('close-user-chat-request', () => {
            handleCloseChat();
        });
        return () => sub.remove();
    }, [handleCloseChat, chatId]);

    const renderItem = ({ item }: { item: ChatMessage }) => (
        <ChatBubble
            message={item}
            isOwn={item.sender === 'user'}
        />
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>

            {/* Chat Content */}
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                {isLoadingChats || isCreatingChat ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <AppText style={{ marginTop: 10 }}>
                            {isCreatingChat ? 'Starting conversation...' : 'Loading chat...'}
                        </AppText>
                    </View>
                ) : (
                    <FlatList
                        data={displayMessages}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id || Math.random().toString()}
                        contentContainerStyle={styles.listContent}
                        ListFooterComponent={
                            awaitingReply ? (
                                <View style={styles.thinking}>
                                    <ActivityIndicator size="small" color={colors.primary} />
                                    <AppText style={{ marginLeft: 8, color: colors.textSecondary }}>
                                        Thinking...
                                    </AppText>
                                </View>
                            ) : null
                        }
                        ListEmptyComponent={
                            <View style={styles.center}>
                                <AppText style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 20 }}>
                                    {chatId ? 'No messages yet.' : 'Send a message to start chatting!'}
                                </AppText>
                            </View>
                        }
                    />
                )}

                {!readOnly && (
                    <View>
                        {/* {isActiveChatSession && (
                            <TouchableOpacity 
                                style={[styles.closeButton, { backgroundColor: colors.error + '15', borderColor: colors.error }]}
                                onPress={handleCloseChat}
                                disabled={isClosingChat}
                            >
                                {isClosingChat ? (
                                    <ActivityIndicator size="small" color={colors.error} />
                                ) : (
                                    <>
                                        <AppIcon name="close-circle-outline" family="MaterialCommunityIcons" size={18} color={colors.error} />
                                        <AppText style={{ color: colors.error, marginLeft: 6 }} weight="medium">
                                            Close Chat & Start New
                                        </AppText>
                                    </>
                                )}
                            </TouchableOpacity>
                        )} */}
                        <ChatInput
                            onSend={handleSend}
                            isLoading={isSending || isCreatingChat}
                            placeholder="Type a message..."
                        />
                    </View>
                )}
            </KeyboardAvoidingView>

            {/* History Modal */}
            <Modal
                visible={showHistory}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowHistory(false)}
            >
                <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                    <View style={[styles.header, { borderBottomColor: colors.border }]}>
                        <TouchableOpacity onPress={() => setShowHistory(false)}>
                            <AppText variant="md" tone="primary">Close</AppText>
                        </TouchableOpacity>
                        <AppText variant="lg" weight="bold">Chat History</AppText>
                        <TouchableOpacity onPress={handleNewChat}>
                            <AppIcon name="plus" family="Feather" size={24} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={userChats}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <ChatListItem
                                chat={item}
                                onPress={handleSelectChat}
                            />
                        )}
                        contentContainerStyle={{ padding: 16 }}
                        ListEmptyComponent={
                            <View style={styles.center}>
                                <AppText>No chat history.</AppText>
                            </View>
                        }
                    />
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
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        width: 80,
    },
    headerTitle: {
        flex: 1,
        alignItems: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        width: 80,
        justifyContent: 'flex-end',
        gap: 12,
    },
    logo: {
        width: 32,
        height: 32,
    },
    iconButton: {
        padding: 4,
    },
    keyboardView: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 20,
    },
    thinking: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    closeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 8,
        borderWidth: 1,
    },
});

export default UserChatScreen;

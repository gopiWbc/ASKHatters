import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';
import AppText from '@/components/ui/atoms/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';
import ClickableView from '@/components/ui/atoms/ClickableOpacity';
import {
    useGetChatMessagesQuery,
    useSendMessageMutation,
    useTakeOverChatMutation,
    useGetCurrentUserQuery
} from '@/services/api';
import { ChatMessage } from '@/types/chat.types';
import AppIcon from '@/components/ui/atoms/AppIcon';

const SupporterChatScreen = ({ route, navigation }: any) => {
    const { chatId } = route.params;
    const { colors } = useAppTheme();

    const { data: currentUser } = useGetCurrentUserQuery();
    const supporterId = currentUser?.id || '';

    // APIs
    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
    const [takeOverChat, { isLoading: isTakingOver }] = useTakeOverChatMutation();

    const { data: messages = [], isLoading: isLoadingMessages } = useGetChatMessagesQuery(chatId, {
        pollingInterval: 3000,
    });

    const handleSend = async (text: string) => {
        try {
            await sendMessage({ chat_id: chatId, text }).unwrap();
        } catch (error) {
            console.error('Failed to send message', error);
            Alert.alert('Error', 'Failed to send message');
        }
    };

    const handleTakeOver = async () => {
        try {
            await takeOverChat({ chatId, supporterId }).unwrap();
            Alert.alert('Success', 'You have taken over this chat.');
        } catch (error) {
            console.error('Failed to take over', error);
            Alert.alert('Error', 'Failed to take over chat');
        }
    };

    const renderItem = ({ item }: { item: ChatMessage }) => (
        <ChatBubble
            message={item}
            isOwn={item.sender === 'supporter'} // Supporter sees their own messages as 'own'
        />
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
            <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
                <View style={styles.headerLeft}>
                    <ClickableView onClick={() => navigation.goBack()} style={{ marginRight: 10 }}>
                        <AppIcon name="ArrowLeft" family="Lucide" size={24} color={colors.text} />
                    </ClickableView>
                    <View>
                        <AppText variant="md" weight="bold">User Chat</AppText>
                        <AppText variant="xs" tone="secondary">ID: {chatId.slice(-6)}</AppText>
                    </View>
                </View>
                <ClickableView
                    style={[styles.takeOverBtn, { backgroundColor: colors.primaryLight }]}
                    onClick={handleTakeOver}
                    disabled={isTakingOver}
                >
                    <AppText variant="xs" style={{ color: colors.primary }} weight="bold">
                        {isTakingOver ? 'Taking over...' : 'Take Over'}
                    </AppText>
                </ClickableView>
            </View>

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <FlatList
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                />

                <ChatInput
                    onSend={handleSend}
                    isLoading={isSending}
                    placeholder="Reply as support..."
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    keyboardView: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        paddingBottom: 20,
    },
    takeOverBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    }
});

export default SupporterChatScreen;

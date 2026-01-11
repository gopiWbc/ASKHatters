import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';
import AppText from '@/components/ui/atoms/AppText';
import ChatListItem from '@/components/chat/ChatListItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetEscalatedChatsQuery, useGetAllChatsQuery, useGetSupporterChatsQuery, useGetCurrentUserQuery, useTakeOverChatMutation } from '@/services/api';
import { ChatSession } from '@/types/chat.types';
import ClickableView from '@/components/ui/atoms/ClickableOpacity';
import { useToast } from 'react-native-toast-notifications';

type Tab = 'active' | 'queue';

const SupporterDashboardScreen = ({ navigation }: any) => {
    const { colors } = useAppTheme();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<Tab>('queue');
    const [isTakingOver, setIsTakingOver] = useState(false);

    // Get current user
    const { data: currentUser } = useGetCurrentUserQuery();
    const supporterId = (currentUser as any)?._id || (currentUser as any)?.id || '';

    // Mutations
    const [takeOverChat] = useTakeOverChatMutation();

    // Queries
    const { data: allChats = [], isLoading: loadingQueue, refetch: refetchQueue } = useGetAllChatsQuery(
        { limit: 20 },
        {
            pollingInterval: 5000,
            skip: activeTab !== 'queue'
        }
    );

    const { data: myChats = [], isLoading: loadingMyChats, refetch: refetchMyChats } = useGetSupporterChatsQuery(
        { supporterId, limit: 20 },
        {
            pollingInterval: 5000,
            skip: !supporterId || activeTab !== 'active'
        }
    );

    const handleChatPress = async (chat: ChatSession) => {
        // If from Queue tab, perform handoff first
        if (activeTab === 'queue') {
            if (!supporterId) {
                toast.show('Unable to identify supporter', { type: 'danger' });
                return;
            }

            setIsTakingOver(true);
            try {
                // Call handoff API
                console.log('=== HANDOFF REQUEST ===');
                console.log('Chat ID:', chat._id);
                console.log('Supporter ID:', supporterId);
                
                await takeOverChat({ chatId: chat._id, supporterId }).unwrap();
                
                console.log('Handoff successful, navigating...');
                toast.show('Chat taken over successfully', { type: 'success' });
                
                // Navigate to chat screen - context will be loaded there
                navigation.navigate('SupporterChat', { chatId: chat._id });
            } catch (error: any) {
                console.error('Failed to take over chat:', error);
                console.error('Error details:', JSON.stringify(error, null, 2));
                const errorMsg = error?.data?.detail || error?.message || 'Failed to take over chat';
                toast.show(errorMsg, { type: 'danger' });
            } finally {
                setIsTakingOver(false);
            }
        } else {
            // Already assigned chat, just navigate
            navigation.navigate('SupporterChat', { chatId: chat._id });
        }
    };

    const renderTab = (tab: Tab, label: string) => (
        <ClickableView
            style={[
                styles.tab,
                activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
            ]}
            onClick={() => setActiveTab(tab)}
        >
            <AppText
                weight={activeTab === tab ? 'bold' : 'regular'}
                style={{ color: activeTab === tab ? colors.primary : colors.textSecondary }}
            >
                {label}
            </AppText>
        </ClickableView>
    );

    const getList = () => {
        const list = activeTab === 'queue' ? allChats : myChats;
        return Array.isArray(list) ? list : list?.data || [];
    };
    const isLoading = activeTab === 'queue' ? loadingQueue : loadingMyChats;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <AppText variant="lg" weight="bold">Supporter Dashboard</AppText>
            </View> */}

            <View style={[styles.tabs, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                {renderTab('queue', 'Queue')}
                {renderTab('active', 'My Active Chats')}
            </View>

            {isTakingOver && (
                <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <AppText style={{ color: colors.surface, marginTop: 10 }}>Taking over chat...</AppText>
                </View>
            )}

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={getList()}
                    renderItem={({ item }) => <ChatListItem chat={item} onPress={handleChatPress} />}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <AppText style={{ color: colors.textSecondary }}>No chats found.</AppText>
                        </View>
                    }
                    onRefresh={() => activeTab === 'queue' ? refetchQueue() : refetchMyChats()}
                    refreshing={isLoading}
                />
            )}
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
        alignItems: 'center',
    },
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    list: {
        paddingBottom: 20,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
});

export default SupporterDashboardScreen;

import React from 'react';
import { View, StyleSheet } from 'react-native';
import ClickableView from '@/components/ui/atoms/ClickableOpacity';
import AppText from '@/components/ui/atoms/AppText';
import AppIcon from '@/components/ui/atoms/AppIcon';
import { useAppTheme } from '@/theme/ThemeProvider';
import { ChatSession } from '@/types/chat.types';
import { spacing, borderRadius } from '@/theme';

type Props = {
    chat: ChatSession;
    onPress: (chat: ChatSession) => void;
};

const ChatListItem: React.FC<Props> = ({ chat, onPress }) => {
    const { colors } = useAppTheme();

    // Helper to get formatted time
    const getTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <ClickableView
            style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
            onClick={() => onPress(chat)}
        >
            <View style={[styles.avatar, { backgroundColor: colors.backgroundSecondary }]}>
                <AppIcon name="person" family="Ionicons" size={24} color={colors.textSecondary} />
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <AppText variant="sm" weight="semibold" numberOfLines={1}>
                        {chat.user_id ? `User pending` : 'Visitor'}
                    </AppText>
                    <AppText variant="xs" style={{ color: colors.textTertiary }}>
                        {getTime(chat.updated_at)}
                    </AppText>
                </View>

                <View style={styles.footer}>
                    <View style={{ flex: 1 }}>
                        <AppText variant="xs" style={{ color: colors.textSecondary }} numberOfLines={1}>
                            <AppText
                                style={[
                                    { color: chat.status === 'active' ? colors.success : colors.textSecondary },
                                    { fontWeight: chat.status === 'active' ? '600' : '400' },
                                ]}
                            >
                                {chat.status === 'active' ? 'Active' : chat.status === 'closed' ? 'Closed' : chat.status}
                            </AppText>
                            {' - '}
                            <AppText style={{ color: colors.textSecondary }}>
                                {chat.current_sentiment || 'Neutral'}
                            </AppText>
                        </AppText>
                    </View>
                    <AppIcon name="ChevronRight" family="Lucide" size={16} color={colors.textTertiary} />
                </View>
            </View>
        </ClickableView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});

export default ChatListItem;

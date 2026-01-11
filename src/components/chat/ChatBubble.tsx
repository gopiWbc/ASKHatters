import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/atoms/AppText';
import { useAppTheme } from '@/theme/ThemeProvider';
import { ChatMessage } from '@/types/chat.types';
import { spacing, borderRadius } from '@/theme';

type Props = {
    message: ChatMessage;
    isOwn: boolean;
};

const formatTime = (value: any) => {
    if (!value) return '--';
    const date =
        typeof value === 'object' && 'seconds' in value
            ? new Date((value as { seconds: number }).seconds * 1000)
            : new Date(value);
    return Number.isNaN(date.getTime())
        ? '--'
        : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatBubble: React.FC<Props> = ({ message, isOwn }) => {
    const { colors } = useAppTheme();

    return (
        <View
            style={[
                styles.container,
                isOwn ? styles.ownMessage : styles.otherMessage,
                {
                    backgroundColor: isOwn ? colors.primary : colors.surface,
                    borderColor: isOwn ? 'transparent' : colors.border
                },
            ]}
        >
            {!isOwn && message.sender === 'supporter' && (
                <AppText variant="xs" style={{ color: colors.primary, marginBottom: 4 }}>
                    Support Agent
                </AppText>
            )}

            <AppText
                variant="sm"
                style={{ color: isOwn ? colors.white : colors.text }}
            >
                {message.text}
            </AppText>

            <AppText
                variant="xs"
                style={[
                    styles.timestamp,
                    { color: isOwn ? 'rgba(255,255,255,0.7)' : colors.textTertiary }
                ]}
            >
                {formatTime(message.created_at)}
            </AppText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        maxWidth: '80%',
        padding: spacing.sm,
        borderRadius: borderRadius.lg,
        marginVertical: 4,
        borderWidth: 1,
    },
    ownMessage: {
        alignSelf: 'flex-end',
        borderBottomRightRadius: 2,
    },
    otherMessage: {
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 2,
    },
    timestamp: {
        alignSelf: 'flex-end',
        marginTop: 4,
        fontSize: 10,
    }
});

export default ChatBubble;

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import ClickableView from '@/components/ui/atoms/ClickableOpacity';
import AppIcon from '@/components/ui/atoms/AppIcon';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, borderRadius } from '@/theme';

type Props = {
    onSend: (text: string) => void;
    isLoading?: boolean;
    placeholder?: string;
    disabled?: boolean;
};

const ChatInput: React.FC<Props> = ({
    onSend,
    isLoading = false,
    placeholder = "Type a messagesss...",
    disabled = false
}) => {
    const { colors } = useAppTheme();
    const [text, setText] = useState('');

    const handleSend = () => {
        if (text.trim() && !isLoading && !disabled) {
            onSend(text.trim());
            setText('');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
            <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
                <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textTertiary}
                    value={text}
                    onChangeText={setText}
                    multiline
                    maxLength={500}
                    editable={!disabled}
                />
            </View>

            <ClickableView
                style={[
                    styles.sendButton,
                    { backgroundColor: text.trim() ? colors.primary : colors.backgroundSecondary }
                ]}
                onClick={handleSend}
                disabled={!text.trim() || isLoading || disabled}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color={colors.white} />
                ) : (
                    <AppIcon
                        name="send"
                        family="Ionicons"
                        size={20}
                        color={text.trim() ? colors.white : colors.textSecondary}
                    />
                )}
            </ClickableView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: spacing.sm,
        borderTopWidth: 1,
    },
    inputContainer: {
        flex: 1,
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        minHeight: 40,
        maxHeight: 100,
        marginRight: spacing.sm,
    },
    input: {
        fontSize: 16,
        paddingTop: spacing.xs + 2,
        paddingBottom: spacing.xs + 2,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ChatInput;

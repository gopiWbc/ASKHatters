import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, StyleSheet, ActivityIndicator, Platform, PermissionsAndroid, Alert } from 'react-native';
import ClickableView from '@/components/ui/atoms/ClickableOpacity';
import AppIcon from '@/components/ui/atoms/AppIcon';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing, borderRadius } from '@/theme';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';

type Props = {
    onSend: (text: string) => void;
    isLoading?: boolean;
    placeholder?: string;
    disabled?: boolean;
};

const ChatInput: React.FC<Props> = ({
    onSend,
    isLoading = false,
    placeholder = "Type a message...",
    disabled = false
}) => {
    const { colors } = useAppTheme();
    const [text, setText] = useState('');
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechResults = onSpeechResults;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const onSpeechStart = (e: any) => {
        setIsListening(true);
    };

    const onSpeechEnd = (e: any) => {
        setIsListening(false);
    };

    const onSpeechError = (e: SpeechErrorEvent) => {
        setIsListening(false);
        console.error('Speech recognition error:', e.error);
        const errorMessage = e.error?.message || 'Unknown speech recognition error';
        Alert.alert('Speech Recognition Error', errorMessage);
    };

    const onSpeechResults = (e: SpeechResultsEvent) => {
        if (e.value && e.value.length > 0) {
            setText(e.value[0]);
        }
    };

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    {
                        title: 'Microphone Permission',
                        message: 'This app needs access to your microphone for speech-to-text.',
                        buttonPositive: 'OK',
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    const startListening = async () => {
        if (disabled || isLoading) return;

        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        try {
            await Voice.start('en-US');
            setIsListening(true);
        } catch (e: any) {
            console.error('Failed to start listening:', e);
            Alert.alert('Failed to Start Listening', e.message || String(e));
        }
    };

    const stopListening = async () => {
        try {
            await Voice.stop();
            setIsListening(false);
        } catch (e) {
            console.error('Failed to stop listening:', e);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const handleSend = () => {
        if (text.trim() && !isLoading && !disabled) {
            onSend(text.trim());
            setText('');
            if (isListening) stopListening();
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
                    styles.iconButton,
                    { backgroundColor: isListening ? colors.error : colors.backgroundSecondary }
                ]}
                onClick={toggleListening}
                disabled={disabled || isLoading}
            >
                <AppIcon
                    name={isListening ? "mic-off" : "mic"}
                    family="Ionicons"
                    size={20}
                    color={isListening ? colors.white : colors.textSecondary}
                />
            </ClickableView>

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
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
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

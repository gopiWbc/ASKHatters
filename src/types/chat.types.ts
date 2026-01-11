export type ChatRole = 'user' | 'assistant' | 'supporter' | 'system';
export type ChatStatus = 'active' | 'waiting' | 'in_progress' | 'resolved' | 'closed' | 'escalated';
export type Sentiment = 'positive' | 'neutral' | 'negative' | 'critical';

export interface ChatMessage {
    id: string; // or _id depending on backend
    chat_id: string;
    sender: ChatRole;
    text: string;
    created_at: string;
    metadata?: {
        sources?: string[];
        sentiment?: Sentiment;
    };
}

export interface ChatSession {
    _id: string;
    user_id: string;
    title: string | null;
    context_summary?: string | null;
    knowledge_ids?: string[];
    status: ChatStatus;
    chat_mode: 'ai' | 'human';
    current_sentiment: Sentiment;
    sentiment_score: number;
    supporter_id?: string | null;
    handoff_at?: string | null;
    handoff_reason?: string | null;
    is_resolved?: boolean;
    resolved_at?: string | null;
    resolved_by?: string | null;
    needs_attention?: boolean;
    alert_reason?: string | null;
    is_window_open?: boolean;
    total_open_duration?: number;
    supporter_joined_at?: string | null;
    supporter_response_time?: number | null;
    supporter_messages_count?: number;
    source?: string | null;
    updated_at: string;
    created_at: string;
    last_message_at?: string | null;
    unread_count?: number; // UI only
}

export interface CreateChatRequest {
    message?: string;
    source?: string;
    user_id: string;
}

export interface SendMessageRequest {
    chat_id: string;
    text: string;
}

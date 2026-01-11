import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './apiClient';
import { ChatMessage, ChatSession, CreateChatRequest, SendMessageRequest } from '@/types/chat.types';

export const chatApi = createApi({
    reducerPath: 'chatApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Chat', 'Message'],
    endpoints: (builder) => ({
        // Create or Get Active Chat
        createChat: builder.mutation<ChatSession, CreateChatRequest>({
            query: (body) => ({
                url: '/chats',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Chat'],
        }),

        // Get Chat History
        getChatMessages: builder.query<ChatMessage[], string>({
            query: (chatId) => `/chats/${chatId}/messages`,
            providesTags: (result, error, chatId) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Message' as const, id })), { type: 'Message', id: 'LIST' }]
                    : [{ type: 'Message', id: 'LIST' }],
        }),

        // Send Message
        sendMessage: builder.mutation<ChatMessage[], SendMessageRequest>({
            query: ({ chat_id, text }) => ({
                url: '/messages',
                method: 'POST',
                body: { chat_id, text, sender: 'user' },
            }),
            // Optimistic Update
            async onQueryStarted({ chat_id, text }, { dispatch, queryFulfilled }) {
                const tempId = Math.random().toString(36).substring(7);
                const tempMessage: ChatMessage = {
                    id: tempId,
                    chat_id,
                    sender: 'user',
                    text,
                    created_at: new Date().toISOString(),
                };

                const patchResult = dispatch(
                    chatApi.util.updateQueryData('getChatMessages', chat_id, (draft) => {
                        draft.push(tempMessage);
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['Message'],
        }),

        // Get Active Chats (useful for verifying if one exists)
        // Get Active Chats (user)
        getUserChats: builder.query<ChatSession[], { userId: string; limit?: number }>({
            query: ({ userId, limit = 20 }) => `/chats/user/${userId}?limit=${limit}`,
            providesTags: ['Chat'],
        }),

        // Supporter: Get Escalated Queue
        getEscalatedChats: builder.query<ChatSession[], void>({
            query: () => '/chats/escalated/list',
            providesTags: ['Chat'],
        }),

        // Get All Chats with pagination
        getAllChats: builder.query<{ data: ChatSession[]; total: number; skip: number; limit: number }, { skip?: number; limit?: number }>({
            query: ({ skip = 0, limit = 20 }) => `/chats?skip=${skip}&limit=${limit}`,
            transformResponse: (response: any, meta) => {
                const { data: responseData, total, skip: responseSkip, limit: responseLimit } = response || {};
                return { data: responseData || [], total: total || 0, skip: responseSkip || 0, limit: responseLimit || 20 };
            },
            providesTags: ['Chat'],
        }),

        // Supporter: Get My Assigned Chats
        getSupporterChats: builder.query<ChatSession[], { supporterId: string; limit?: number }>({
            query: ({ supporterId, limit = 20 }) => `/chats/supporter/${supporterId}?limit=${limit}`,
            transformResponse: (response: any) => response?.data || response || [],
            providesTags: ['Chat'],
        }),

        // Supporter: Take Over Chat (Handoff)
        takeOverChat: builder.mutation<ChatSession, { chatId: string; supporterId: string }>({
            query: ({ chatId, supporterId }) => {
                console.log('=== HANDOFF API CALL ===');
                console.log('URL:', `/chats/${chatId}/handoff`);
                console.log('Payload:', JSON.stringify({ supporter_id: supporterId, reason: 'supporter_takeover' }, null, 2));
                return {
                    url: `/chats/${chatId}/handoff`,
                    method: 'POST',
                    body: { supporter_id: supporterId, reason: 'supporter_takeover' },
                };
            },
            invalidatesTags: ['Chat'],
        }),

        // Get Chat Context for Supporter
        getChatContext: builder.query<any, string>({
            query: (chatId) => `/chats/${chatId}/context`,
        }),

        // Close Chat Session
        closeChat: builder.mutation<ChatSession, string>({
            query: (chatId) => ({
                url: `/chats/${chatId}/close`,
                method: 'POST',
            }),
            invalidatesTags: ['Chat'],
        }),
    }),
});

export const {
    useCreateChatMutation,
    useGetChatMessagesQuery,
    useSendMessageMutation,
    useGetUserChatsQuery,
    useGetEscalatedChatsQuery,
    useGetAllChatsQuery,
    useGetSupporterChatsQuery,
    useTakeOverChatMutation,
    useLazyGetChatContextQuery,
    useCloseChatMutation,
} = chatApi;

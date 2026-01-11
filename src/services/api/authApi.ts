
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './apiClient';
import { API_ENDPOINTS } from '../../constants';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  ApiResponse,
  UpdateUserRequest,
} from '../../types';

/**
 * Authentication API Service using RTK Query
 * All auth-related API endpoints
 */

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Auth'],
  endpoints: (builder) => ({
    /**
     * Login user
     */
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    /**
     * Register new user
     */
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.REGISTER,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    /**
     * Logout user
     */
    logout: builder.mutation<void, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.LOGOUT,
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          // Even if API call fails, still clear cache
        }
        // Reset all API caches on logout
        dispatch(authApi.util.resetApiState());
      },
    }),

    /**
     * Get current user
     */
    getCurrentUser: builder.query<User, string | void>({
      query: (token) => {
        console.log('GetCurrentUser Request', token ? '(with explicit token)' : '(using stored token)');
        return {
          url: API_ENDPOINTS.AUTH.ME,
          method: 'GET',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        };
      },
      providesTags: ['User'],
    }),

    /**
     * Refresh access token
     */
    refreshToken: builder.mutation<AuthResponse, { refresh_token: string }>({
      query: ({ refresh_token }) => ({
        url: API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        method: 'POST',
        body: { refresh_token },
      }),
    }),

    /**
     * Update current user profile
     */
    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.USER.UPDATE,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
  useUpdateUserMutation,
} = authApi;

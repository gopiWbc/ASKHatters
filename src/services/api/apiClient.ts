import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { ENV } from '../../constants';
import { storage, STORAGE_KEYS } from '../../utils';

/**
 * RTK Query Base Query Configuration
 * Custom base query with token handling
 */

const rawBaseQuery = fetchBaseQuery({
  baseUrl: ENV.API_URL,
  timeout: ENV.API_TIMEOUT,
});

/**
 * Base query with token refresh logic
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // DEBUG: Log Request
  console.log('--- [API Request] ---');
  console.log('Base URL:', ENV.API_URL);
  console.log('Endpoint:', typeof args === 'string' ? args : args.url);
  console.log('Full URL:', ENV.API_URL + (typeof args === 'string' ? args : args.url));
  console.log('Method:', typeof args === 'string' ? 'GET' : args.method);
  if (typeof args !== 'string' && args.body) {
    console.log('Body:', JSON.stringify(args.body, null, 2));
  }

  // Normalize args and inject headers (avoid auth headers on auth endpoints)
  const isAuthPath = (url: string) =>
    url.startsWith('/auth/login') || url.startsWith('/auth/register') || url.startsWith('/auth/refresh');

  const argsObj: FetchArgs =
    typeof args === 'string'
      ? { url: args, method: 'GET' }
      : { ...args };

  const headers = new Headers(argsObj.headers as any);
  
  // Only inject token from storage if Authorization header is not already set
  if (!headers.has('Authorization') && !isAuthPath(argsObj.url)) {
    const token = await storage.getItem<string>(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  argsObj.headers = headers;

  let result = await rawBaseQuery(argsObj, api, extraOptions);

  // DEBUG: Log Response
  if (result.error) {
    console.log('--- [API Error] ---', result.error);
  } else {
    // console.log('--- [API Success] ---', JSON.stringify(result.data, null, 2)); // Optional: Log response
  }

  // Handle 401 Unauthorized - token refresh logic
  if (result.error && result.error.status === 401) {
    console.log('--- [API] 401 Detected - Attempting Refresh ---');
    // Try to refresh token
    const refreshToken = await storage.getItem<string>(STORAGE_KEYS.REFRESH_TOKEN);

    if (refreshToken) {
      // Attempt to refresh with proper headers
      const refreshHeaders = new Headers();
      refreshHeaders.set('Content-Type', 'application/json');
      refreshHeaders.set('Accept', 'application/json');
      
      const refreshResult = await rawBaseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refresh_token: refreshToken },
          headers: refreshHeaders,
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        console.log('--- [API] Token Refreshed ---');
        // Store new token and retry original request
        const { access_token } = refreshResult.data as any;
        await storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);

        // Retry the original request with updated token header
        const retryHeaders = new Headers(argsObj.headers as any);
        const newToken = await storage.getItem<string>(STORAGE_KEYS.ACCESS_TOKEN);
        if (newToken && !isAuthPath(argsObj.url)) {
          retryHeaders.set('Authorization', `Bearer ${newToken}`);
        } else {
          retryHeaders.delete('Authorization');
        }
        argsObj.headers = retryHeaders;
        result = await rawBaseQuery(argsObj, api, extraOptions);
      } else {
        console.log('--- [API] Refresh Failed ---');
        // Refresh failed - clear tokens
        await storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        await storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      }
    }
  }

  return result;
};

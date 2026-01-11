/**
 * Environment Configuration
 * Central place for all environment variables and API endpoints
 */

export const ENV = {
  API_URL: 'https://hatters.proscaler.ai/api/v1',
  API_TIMEOUT: 30000,
  ENV_MODE: __DEV__ ? 'development' : 'production',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    ME: '/auth/me',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
  },
} as const;

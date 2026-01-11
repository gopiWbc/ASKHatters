/**
 * Authentication Related Types
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  username?: string;
  roles?: string[];
  membership_tier?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface User {
  _id: string; // Backend uses _id
  id?: string; // For backward compatibility if needed, or remove
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  username?: string;
  county?: string | null;
  city?: string | null;
  membership_tier?: string | null;
  roles: string[];
  is_active: boolean;
  is_verified: boolean;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  username?: string;
  county?: string | null;
  city?: string | null;
  profile_picture?: string;
}

import apiClient from './client.js';

export interface User {
  id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  emailVerified: boolean;
  settings: {
    theme: 'light' | 'dark';
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// Register user
export const register = async (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

// Login user
export const login = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
};

// Get current user
export const getCurrentUser = async (): Promise<{ success: boolean; data: { user: User } }> => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

// Verify email
export const verifyEmail = async (token: string): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.get(`/auth/verify-email/${token}`);
  return response.data;
};

// Forgot password
export const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
};

// Reset password
export const resetPassword = async (token: string, password: string): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post('/auth/reset-password', { token, password });
  return response.data;
};

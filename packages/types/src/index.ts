// Re-export all types from database models
export { IUser, IProject, IClient, ISkill, IService, IResume, ICompany, IJob, IInvoice, IPayment, INotification, ISetting, IMedia, IActivity, ITag, ICategory } from '../database/src/models';

// Common API response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  count?: number;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// User types
export interface UserProfile {
  id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    bio?: string;
  };
  role: 'user' | 'admin' | 'superadmin';
  settings: {
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
  emailVerified: boolean;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

// Query types
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterQuery {
  [key: string]: any;
}
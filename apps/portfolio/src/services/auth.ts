import { AuthResponse } from '../types/auth';
import { postJson } from './api';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const register = (payload: RegisterPayload) => postJson<RegisterPayload, AuthResponse>('/auth/register', payload);
export const login = (payload: LoginPayload) => postJson<LoginPayload, AuthResponse>('/auth/login', payload);

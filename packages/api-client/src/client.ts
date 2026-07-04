import axios, { AxiosError, AxiosInstance } from 'axios';

type ImportMetaWithEnv = ImportMeta & {
  env?: Record<string, string | undefined>;
};

const getApiBaseUrl = (): string => {
  const viteEnv = (import.meta as ImportMetaWithEnv).env;
  return viteEnv?.VITE_API_URL || 'http://localhost:3000/api';
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('pv_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof localStorage !== 'undefined') {
      localStorage.removeItem('pv_token');
      localStorage.removeItem('pv_user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

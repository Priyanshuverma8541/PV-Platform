const API_BASE_URL = '/api/v1';

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      requestHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...requestHeaders,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: `HTTP error! status: ${response.status}`,
      }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{
      token: string;
      refreshToken: string;
      user: any;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    return this.request<{
      token: string;
      refreshToken: string;
      user: any;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request<any>('/auth/me');
  }

  async updateProfile(data: any) {
    return this.request<any>('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Settings endpoints
  async getSetting(key: string) {
    return this.request<{ key: string; value: any }>(`/settings/${key}`);
  }

  async updateSetting(key: string, value: any) {
    return this.request<{ key: string; value: any }>(`/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
  }

  async getAllSettings() {
    return this.request<Record<string, any>>('/settings');
  }

  // Apps endpoints
  async getApps() {
    return this.request<any[]>('/apps');
  }

  async getApp(slug: string) {
    return this.request<any>(`/apps/${slug}`);
  }

  // Objects endpoints
  async getObjects(objectType: string, params?: Record<string, any>) {
    const queryString = new URLSearchParams(params).toString();
    return this.request<any[]>(`/objects/${objectType}?${queryString}`);
  }

  async getObject(objectType: string, id: string) {
    return this.request<any>(`/objects/${objectType}/${id}`);
  }

  async createObject(objectType: string, data: any) {
    return this.request<any>(`/objects/${objectType}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateObject(objectType: string, id: string, data: any) {
    return this.request<any>(`/objects/${objectType}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteObject(objectType: string, id: string) {
    return this.request<void>(`/objects/${objectType}/${id}`, {
      method: 'DELETE',
    });
  }

  // Search endpoint
  async search(query: string, filters?: Record<string, any>) {
    const params = new URLSearchParams({ q: query, ...filters });
    return this.request<any>(`/search?${params}`);
  }

  // AI endpoints
  async chat(message: string, conversationId?: string) {
    return this.request<{ response: string; conversationId: string }>(
      '/ai/chat',
      {
        method: 'POST',
        body: JSON.stringify({ message, conversationId }),
      }
    );
  }

  async generate(prompt: string, options?: Record<string, any>) {
    return this.request<{ content: string }>('/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, ...options }),
    });
  }

  async getAIProviders() {
    return this.request<string[]>('/ai/providers');
  }

  async getAIConfig() {
    return this.request<any>('/ai/config');
  }

  async updateAIConfig(config: any) {
    return this.request<any>('/ai/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }

  // Analytics endpoints
  async trackEvent(event: string, metadata?: Record<string, any>) {
    return this.request<void>('/analytics/events', {
      method: 'POST',
      body: JSON.stringify({ event, metadata }),
    });
  }

  async getAnalytics(params?: Record<string, any>) {
    const queryString = new URLSearchParams(params).toString();
    return this.request<any>(`/analytics/metrics?${queryString}`);
  }

  // Notifications endpoints
  async getNotifications() {
    return this.request<any[]>('/notifications');
  }

  async markNotificationAsRead(id: string) {
    return this.request<void>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
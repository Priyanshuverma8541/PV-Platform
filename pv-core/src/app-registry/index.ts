export interface AppEndpoint {
  frontend: string;
  backend: string;
  websocket?: string;
}

export interface AppFeature {
  hasDatabase: boolean;
  hasCloudinaryFolder: boolean;
  requiresSubscription: boolean;
}

export interface AppMetadata {
  author: string;
  homepage: string;
  repository: string;
}

export interface AppDefinition {
  id: string;
  name: string;
  slug: string;
  displayName: string;
  description: string;
  icon: string;
  version: string;
  status: 'active' | 'inactive' | 'maintenance';
  endpoints: AppEndpoint;
  metadata: AppMetadata;
  features: AppFeature;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AppInstallation {
  userId: string;
  appId: string;
  config: Record<string, any>;
  enabled: boolean;
  permissions: string[];
  installDate: Date;
}

export class AppRegistry {
  private apps: Map<string, AppDefinition> = new Map();
  private installations: Map<string, AppInstallation[]> = new Map();

  async registerApp(app: Omit<AppDefinition, 'id' | 'createdAt' | 'updatedAt'>): Promise<AppDefinition> {
    const newApp: AppDefinition = {
      ...app,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.apps.set(newApp.id, newApp);
    return newApp;
  }

  async getApps(): Promise<AppDefinition[]> {
    return Array.from(this.apps.values());
  }

  async getApp(id: string): Promise<AppDefinition | null> {
    return this.apps.get(id) || null;
  }

  async getAppBySlug(slug: string): Promise<AppDefinition | null> {
    return Array.from(this.apps.values()).find(app => app.slug === slug) || null;
  }

  async updateApp(id: string, updates: Partial<AppDefinition>): Promise<AppDefinition | null> {
    const app = this.apps.get(id);
    if (!app) return null;

    const updatedApp = {
      ...app,
      ...updates,
      id,
      updatedAt: new Date()
    };
    this.apps.set(id, updatedApp);
    return updatedApp;
  }

  async unregisterApp(id: string): Promise<boolean> {
    return this.apps.delete(id);
  }

  async installApp(userId: string, appId: string, config?: Record<string, any>): Promise<AppInstallation> {
    const installations = this.installations.get(userId) || [];
    
    const installation: AppInstallation = {
      userId,
      appId,
      config: config || {},
      enabled: true,
      permissions: [],
      installDate: new Date()
    };

    installations.push(installation);
    this.installations.set(userId, installations);
    return installation;
  }

  async uninstallApp(userId: string, appId: string): Promise<boolean> {
    const installations = this.installations.get(userId) || [];
    const index = installations.findIndex(i => i.appId === appId);
    
    if (index === -1) return false;
    
    installations.splice(index, 1);
    this.installations.set(userId, installations);
    return true;
  }

  async getUserApps(userId: string): Promise<AppInstallation[]> {
    return this.installations.get(userId) || [];
  }

  async isAppInstalled(userId: string, appId: string): Promise<boolean> {
    const installations = this.installations.get(userId) || [];
    return installations.some(i => i.appId === appId);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

export const appRegistry = new AppRegistry();
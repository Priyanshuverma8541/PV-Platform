export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationChannel;
  subject: string;
  body: string;
  actionUrl?: string;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  sentAt?: Date;
}

export interface NotificationPreferences {
  userId: string;
  channel: NotificationChannel;
  events: Record<string, boolean>;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

export class NotificationEngine {
  private notifications: Map<string, Notification[]> = new Map();
  private preferences: Map<string, NotificationPreferences[]> = new Map();
  private templates: Map<string, NotificationTemplate> = new Map();

  async send(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      createdAt: new Date()
    };

    const userNotifications = this.notifications.get(notification.userId) || [];
    userNotifications.push(newNotification);
    this.notifications.set(notification.userId, userNotifications);

    // TODO: Actually send the notification via the appropriate channel
    console.log(`Sending ${notification.type} notification to user ${notification.userId}:`, notification.subject);

    return newNotification;
  }

  async getNotifications(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    const userNotifications = this.notifications.get(userId) || [];
    return unreadOnly ? userNotifications.filter(n => !n.read) : userNotifications;
  }

  async markAsRead(userId: string, notificationId: string): Promise<boolean> {
    const userNotifications = this.notifications.get(userId) || [];
    const notification = userNotifications.find(n => n.id === notificationId);
    
    if (!notification) return false;

    notification.read = true;
    notification.readAt = new Date();
    return true;
  }

  async markAllAsRead(userId: string): Promise<void> {
    const userNotifications = this.notifications.get(userId) || [];
    userNotifications.forEach(n => {
      n.read = true;
      n.readAt = new Date();
    });
  }

  async setPreferences(preferences: Omit<NotificationPreferences, 'userId'> & { userId: string }): Promise<NotificationPreferences> {
    const newPrefs: NotificationPreferences = {
      ...preferences,
      userId: preferences.userId
    };

    const userPrefs = this.preferences.get(preferences.userId) || [];
    const existingIndex = userPrefs.findIndex(p => p.channel === preferences.channel);
    
    if (existingIndex >= 0) {
      userPrefs[existingIndex] = newPrefs;
    } else {
      userPrefs.push(newPrefs);
    }

    this.preferences.set(preferences.userId, userPrefs);
    return newPrefs;
  }

  async getPreferences(userId: string): Promise<NotificationPreferences[]> {
    return this.preferences.get(userId) || [];
  }

  async shouldSend(userId: string, eventType: string, channel: NotificationChannel): Promise<boolean> {
    const userPrefs = this.preferences.get(userId) || [];
    const channelPref = userPrefs.find(p => p.channel === channel);
    
    if (!channelPref) return true; // Default to sending if no preferences set

    return channelPref.events[eventType] ?? true;
  }

  async createTemplate(template: Omit<NotificationTemplate, 'id'>): Promise<NotificationTemplate> {
    const newTemplate: NotificationTemplate = {
      ...template,
      id: this.generateId()
    };
    this.templates.set(newTemplate.id, newTemplate);
    return newTemplate;
  }

  async getTemplate(id: string): Promise<NotificationTemplate | null> {
    return this.templates.get(id) || null;
  }

  async getAllTemplates(): Promise<NotificationTemplate[]> {
    return Array.from(this.templates.values());
  }

  async sendFromTemplate(
    templateId: string,
    userId: string,
    variables: Record<string, any>
  ): Promise<Notification | null> {
    const template = this.templates.get(templateId);
    if (!template) return null;

    const subject = this.interpolate(template.subject, variables);
    const body = this.interpolate(template.body, variables);

    return this.send({
      userId,
      type: 'in_app',
      subject,
      body,
      read: false
    });
  }

  private interpolate(template: string, variables: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] || match;
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

export const notificationEngine = new NotificationEngine();
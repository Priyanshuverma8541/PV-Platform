/**
 * Notification Engine - Platform-wide notification system
 * Supports Email, SMS, Push, Slack, Discord, WhatsApp
 */

export interface NotificationChannel {
  type: 'email' | 'sms' | 'push' | 'slack' | 'discord' | 'whatsapp';
  enabled: boolean;
  config: Record<string, any>;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  channel: string;
  subject?: string;
  body: string;
  variables: string[];
}

export interface Notification {
  id: string;
  userId: string;
  channel: string;
  templateId?: string;
  subject?: string;
  body: string;
  data: Record<string, any>;
  status: 'pending' | 'sent' | 'failed' | 'delivered';
  scheduledAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  error?: string;
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
}

export interface NotificationPreferences {
  userId: string;
  email: boolean;
  sms: boolean;
  push: boolean;
  slack: boolean;
  discord: boolean;
  whatsapp: boolean;
}

export class NotificationEngine {
  private channels: Map<string, NotificationChannel> = new Map();
  private templates: Map<string, NotificationTemplate> = new Map();
  private notifications: Map<string, Notification> = new Map();
  private preferences: Map<string, NotificationPreferences> = new Map();

  /**
   * Register a notification channel
   */
  registerChannel(channel: NotificationChannel): void {
    this.channels.set(channel.type, channel);
  }

  /**
   * Register a notification template
   */
  registerTemplate(template: Omit<NotificationTemplate, 'id'>): NotificationTemplate {
    const newTemplate: NotificationTemplate = {
      ...template,
      id: this.generateId()
    };
    this.templates.set(newTemplate.id, newTemplate);
    return newTemplate;
  }

  /**
   * Get user notification preferences
   */
  getPreferences(userId: string): NotificationPreferences {
    const prefs = this.preferences.get(userId);
    
    if (!prefs) {
      const defaultPrefs: NotificationPreferences = {
        userId,
        email: true,
        sms: false,
        push: true,
        slack: false,
        discord: false,
        whatsapp: false
      };
      this.preferences.set(userId, defaultPrefs);
      return defaultPrefs;
    }

    return prefs;
  }

  /**
   * Update user notification preferences
   */
  updatePreferences(userId: string, preferences: Partial<NotificationPreferences>): NotificationPreferences {
    const current = this.getPreferences(userId);
    const updated = { ...current, ...preferences };
    this.preferences.set(userId, updated);
    return updated;
  }

  /**
   * Send a notification
   */
  async send(notification: Omit<Notification, 'id' | 'createdAt' | 'retryCount'>): Promise<Notification> {
    const prefs = this.getPreferences(notification.userId);
    const channel = this.channels.get(notification.channel);

    if (!channel || !channel.enabled) {
      throw new Error(`Channel ${notification.channel} is not enabled`);
    }

    // Check user preferences
    if (!prefs[notification.channel as keyof NotificationPreferences]) {
      throw new Error(`User has disabled ${notification.channel} notifications`);
    }

    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      status: 'pending',
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date()
    };

    this.notifications.set(newNotification.id, newNotification);

    // Send notification
    try {
      await this.deliver(newNotification);
      newNotification.status = 'sent';
      newNotification.sentAt = new Date();
    } catch (error) {
      newNotification.status = 'failed';
      newNotification.error = error instanceof Error ? error.message : 'Unknown error';
      
      // Retry logic
      if (newNotification.retryCount < newNotification.maxRetries) {
        await this.scheduleRetry(newNotification);
      }
    }

    return newNotification;
  }

  /**
   * Schedule notification for later
   */
  async schedule(notification: Omit<Notification, 'id' | 'createdAt' | 'retryCount'>, scheduledAt: Date): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      status: 'pending',
      scheduledAt,
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date()
    };

    this.notifications.set(newNotification.id, newNotification);
    return newNotification;
  }

  /**
   * Get notification history
   */
  getNotifications(userId: string, limit: number = 50): Notification[] {
    const userNotifications = Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);

    return userNotifications;
  }

  /**
   * Mark notification as delivered
   */
  markAsDelivered(notificationId: string): boolean {
    const notification = this.notifications.get(notificationId);
    
    if (!notification) return false;

    notification.status = 'delivered';
    notification.deliveredAt = new Date();

    return true;
  }

  /**
   * Deliver notification through channel
   */
  private async deliver(notification: Notification): Promise<void> {
    const channel = this.channels.get(notification.channel);
    
    if (!channel) {
      throw new Error(`Channel ${notification.channel} not found`);
    }

    // Channel-specific delivery logic would go here
    // This is a placeholder for actual implementation
    console.log(`Delivering ${notification.channel} notification:`, notification.body);
    
    // Simulate delivery
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Schedule retry for failed notification
   */
  private async scheduleRetry(notification: Notification): Promise<void> {
    const delay = Math.min(1000 * Math.pow(2, notification.retryCount), 30000); // Exponential backoff, max 30s
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    notification.retryCount++;
    notification.status = 'pending';
    
    try {
      await this.deliver(notification);
      notification.status = 'sent';
      notification.sentAt = new Date();
      notification.error = undefined;
    } catch (error) {
      notification.error = error instanceof Error ? error.message : 'Unknown error';
      
      if (notification.retryCount >= notification.maxRetries) {
        notification.status = 'failed';
      }
    }
  }

  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

// Global notification engine instance
export const notificationEngine = new NotificationEngine();
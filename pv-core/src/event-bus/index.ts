/**
 * Event Bus - Internal event-driven architecture
 * Enables loose coupling between services through events
 */

export interface PlatformEvent {
  id: string;
  type: string;
  payload: Record<string, any>;
  metadata: {
    userId?: string;
    source: string;
    timestamp: Date;
    correlationId?: string;
  };
}

export interface EventHandler {
  eventType: string;
  handler: (event: PlatformEvent) => Promise<void>;
}

export class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();
  private eventHistory: PlatformEvent[] = [];
  private maxHistorySize: number = 1000;

  /**
   * Register an event handler
   */
  on(eventType: string, handler: (event: PlatformEvent) => Promise<void>): void {
    const existing = this.handlers.get(eventType) || [];
    existing.push({ eventType, handler });
    this.handlers.set(eventType, existing);
  }

  /**
   * Emit an event to all registered handlers
   */
  async emit(event: Omit<PlatformEvent, 'id' | 'metadata'> & { metadata?: Partial<PlatformEvent['metadata']> }): Promise<void> {
    const platformEvent: PlatformEvent = {
      id: this.generateId(),
      type: event.type,
      payload: event.payload,
      metadata: {
        source: 'platform',
        timestamp: new Date(),
        ...event.metadata
      }
    };

    // Store in history
    this.eventHistory.push(platformEvent);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // Execute handlers
    const handlers = this.handlers.get(event.type) || [];
    const promises = handlers.map(handler => 
      this.executeHandler(handler.handler, platformEvent)
    );

    await Promise.allSettled(promises);
  }

  /**
   * Execute a single handler with error handling
   */
  private async executeHandler(
    handler: (event: PlatformEvent) => Promise<void>,
    event: PlatformEvent
  ): Promise<void> {
    try {
      await handler(event);
    } catch (error) {
      console.error(`Event handler failed for ${event.type}:`, error);
      // Don't throw - allow other handlers to execute
    }
  }

  /**
   * Get event history
   */
  getHistory(eventType?: string, limit: number = 100): PlatformEvent[] {
    let history = this.eventHistory;
    
    if (eventType) {
      history = history.filter(e => e.type === eventType);
    }

    return history.slice(-limit);
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
  }

  private generateId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

// Global event bus instance
export const eventBus = new EventBus();

// Common event types
export const EventTypes = {
  // User events
  USER_REGISTERED: 'user.registered',
  USER_LOGGED_IN: 'user.logged_in',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  
  // Auth events
  PASSWORD_RESET_REQUESTED: 'auth.password_reset_requested',
  PASSWORD_RESET_COMPLETED: 'auth.password_reset_completed',
  EMAIL_VERIFIED: 'auth.email_verified',
  
  // AI events
  AI_RESPONSE_GENERATED: 'ai.response_generated',
  AI_USAGE_LIMIT_REACHED: 'ai.usage_limit_reached',
  
  // Notification events
  NOTIFICATION_SENT: 'notification.sent',
  NOTIFICATION_FAILED: 'notification.failed',
  
  // Media events
  MEDIA_UPLOADED: 'media.uploaded',
  MEDIA_DELETED: 'media.deleted',
  
  // Application events
  APP_INSTALLED: 'app.installed',
  APP_UNINSTALLED: 'app.uninstalled',
  
  // Project events
  PROJECT_CREATED: 'project.created',
  PROJECT_UPDATED: 'project.updated',
  PROJECT_DELETED: 'project.deleted',
  
  // Career events
  JOB_APPLICATION_SUBMITTED: 'career.application_submitted',
  
  // CRM events
  LEAD_CREATED: 'crm.lead_created',
  LEAD_CONVERTED: 'crm.lead_converted',
  
  // Learning events
  COURSE_ENROLLED: 'learning.course_enrolled',
  COURSE_COMPLETED: 'learning.course_completed',
  
  // Finance events
  PAYMENT_RECEIVED: 'finance.payment_received',
  INVOICE_GENERATED: 'finance.invoice_generated',
  
  // Analytics events
  ANALYTICS_TRACKED: 'analytics.tracked'
} as const;
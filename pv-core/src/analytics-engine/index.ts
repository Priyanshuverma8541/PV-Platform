/**
 * Analytics Engine - Platform-wide analytics collection and tracking
 * Tracks users, projects, visitors, learning progress, AI usage, revenue, etc.
 */

export interface AnalyticsEvent {
  id: string;
  userId?: string;
  event: string;
  app?: string;
  objectType?: string;
  objectId?: string;
  metadata: Record<string, any>;
  timestamp: Date;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AnalyticsMetrics {
  totalUsers: number;
  activeUsers: number;
  totalEvents: number;
  eventsByType: Record<string, number>;
  topApps: Array<{ app: string; count: number }>;
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface UserAnalytics {
  userId: string;
  totalEvents: number;
  firstSeen: Date;
  lastSeen: Date;
  apps: string[];
  eventTypes: string[];
}

export class AnalyticsEngine {
  private events: AnalyticsEvent[] = [];
  private maxEvents: number = 100000; // Keep last 100k events in memory
  private userSessions: Map<string, Date> = new Map();

  /**
   * Track an analytics event
   */
  track(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): AnalyticsEvent {
    const analyticsEvent: AnalyticsEvent = {
      ...event,
      id: this.generateId(),
      timestamp: new Date()
    };

    this.events.push(analyticsEvent);

    // Trim old events if exceeding max
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Update user session
    if (event.userId) {
      this.userSessions.set(event.userId, new Date());
    }

    return analyticsEvent;
  }

  /**
   * Track page view
   */
  trackPageView(userId: string, page: string, metadata?: Record<string, any>): AnalyticsEvent {
    return this.track({
      userId,
      event: 'page_view',
      metadata: {
        page,
        ...metadata
      }
    });
  }

  /**
   * Track user action
   */
  trackAction(userId: string, action: string, metadata?: Record<string, any>): AnalyticsEvent {
    return this.track({
      userId,
      event: 'action',
      metadata: {
        action,
        ...metadata
      }
    });
  }

  /**
   * Track API call
   */
  trackAPICall(userId: string, endpoint: string, method: string, statusCode: number, duration: number): AnalyticsEvent {
    return this.track({
      userId,
      event: 'api_call',
      metadata: {
        endpoint,
        method,
        statusCode,
        duration
      }
    });
  }

  /**
   * Track AI usage
   */
  trackAIUsage(userId: string, feature: string, provider: string, model: string, tokens: number): AnalyticsEvent {
    return this.track({
      userId,
      event: 'ai_usage',
      metadata: {
        feature,
        provider,
        model,
        tokens
      }
    });
  }

  /**
   * Get events with filters
   */
  getEvents(filters?: {
    userId?: string;
    event?: string;
    app?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): AnalyticsEvent[] {
    let filtered = this.events;

    if (filters?.userId) {
      filtered = filtered.filter(e => e.userId === filters.userId);
    }

    if (filters?.event) {
      filtered = filtered.filter(e => e.event === filters.event);
    }

    if (filters?.app) {
      filtered = filtered.filter(e => e.app === filters.app);
    }

    if (filters?.startDate) {
      filtered = filtered.filter(e => e.timestamp >= filters.startDate!);
    }

    if (filters?.endDate) {
      filtered = filtered.filter(e => e.timestamp <= filters.endDate!);
    }

    const limit = filters?.limit || 100;
    return filtered.slice(-limit).reverse();
  }

  /**
   * Get user analytics
   */
  getUserAnalytics(userId: string): UserAnalytics | null {
    const userEvents = this.events.filter(e => e.userId === userId);
    
    if (userEvents.length === 0) {
      return null;
    }

    const eventTypes = [...new Set(userEvents.map(e => e.event))];
    const apps = [...new Set(userEvents.map(e => e.app).filter((app): app is string => app !== undefined))];

    return {
      userId,
      totalEvents: userEvents.length,
      firstSeen: userEvents[0].timestamp,
      lastSeen: userEvents[userEvents.length - 1].timestamp,
      apps,
      eventTypes
    };
  }

  /**
   * Get platform metrics
   */
  getMetrics(filters?: { startDate?: Date; endDate?: Date }): AnalyticsMetrics {
    let filtered = this.events;

    if (filters?.startDate) {
      filtered = filtered.filter(e => e.timestamp >= filters.startDate!);
    }

    if (filters?.endDate) {
      filtered = filtered.filter(e => e.timestamp <= filters.endDate!);
    }

    const eventsByType: Record<string, number> = {};
    const appCounts: Record<string, number> = {};
    const userIds = new Set<string>();

    for (const event of filtered) {
      eventsByType[event.event] = (eventsByType[event.event] || 0) + 1;
      
      if (event.app) {
        appCounts[event.app] = (appCounts[event.app] || 0) + 1;
      }

      if (event.userId) {
        userIds.add(event.userId);
      }
    }

    const topApps = Object.entries(appCounts)
      .map(([app, count]) => ({ app, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const startDate = filters?.startDate || this.events[0]?.timestamp || new Date();
    const endDate = filters?.endDate || this.events[this.events.length - 1]?.timestamp || new Date();

    return {
      totalUsers: userIds.size,
      activeUsers: userIds.size, // Could be refined to last 30 days
      totalEvents: filtered.length,
      eventsByType,
      topApps,
      dateRange: { start: startDate, end: endDate }
    };
  }

  /**
   * Get event count over time
   */
  getEventTimeline(filters?: { event?: string; days?: number }): Array<{ date: string; count: number }> {
    const days = filters?.days || 30;
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    let filtered = this.events.filter(e => e.timestamp >= startDate);

    if (filters?.event) {
      filtered = filtered.filter(e => e.event === filters.event);
    }

    // Group by date
    const timeline: Record<string, number> = {};
    
    for (const event of filtered) {
      const date = event.timestamp.toISOString().split('T')[0];
      timeline[date] = (timeline[date] || 0) + 1;
    }

    // Fill in missing dates
    const result: Array<{ date: string; count: number }> = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      result.push({
        date: dateStr,
        count: timeline[dateStr] || 0
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }

  /**
   * Clear all events
   */
  clear(): void {
    this.events = [];
    this.userSessions.clear();
  }

  private generateId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

// Global analytics engine instance
export const analyticsEngine = new AnalyticsEngine();
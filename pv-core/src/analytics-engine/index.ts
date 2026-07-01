export interface AnalyticsEvent {
  id: string;
  userId: string;
  event: string;
  app?: string;
  objectType?: string;
  objectId?: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

export interface Metric {
  date: Date;
  metric: string;
  value: number;
  dimension?: string;
}

export interface AnalyticsReport {
  period: {
    start: Date;
    end: Date;
  };
  metrics: Metric[];
  summary: {
    totalEvents: number;
    uniqueUsers: number;
    topEvents: Array<{ event: string; count: number }>;
  };
}

export class AnalyticsEngine {
  private events: AnalyticsEvent[] = [];
  private metrics: Metric[] = [];

  async trackEvent(eventData: {
    userId: string;
    event: string;
    app?: string;
    objectType?: string;
    objectId?: string;
    metadata?: Record<string, any>;
  }): Promise<AnalyticsEvent> {
    const event: AnalyticsEvent = {
      id: this.generateId(),
      userId: eventData.userId,
      event: eventData.event,
      app: eventData.app,
      objectType: eventData.objectType,
      objectId: eventData.objectId,
      metadata: eventData.metadata || {},
      timestamp: new Date()
    };

    this.events.push(event);
    return event;
  }

  async getEvents(filters?: {
    userId?: string;
    event?: string;
    app?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<AnalyticsEvent[]> {
    let results = this.events;

    if (filters?.userId) {
      results = results.filter(e => e.userId === filters.userId);
    }
    if (filters?.event) {
      results = results.filter(e => e.event === filters.event);
    }
    if (filters?.app) {
      results = results.filter(e => e.app === filters.app);
    }
    if (filters?.startDate) {
      results = results.filter(e => e.timestamp >= filters.startDate!);
    }
    if (filters?.endDate) {
      results = results.filter(e => e.timestamp <= filters.endDate!);
    }

    const limit = filters?.limit || 100;
    return results.slice(-limit);
  }

  async getMetrics(filters?: {
    metric?: string;
    startDate?: Date;
    endDate?: Date;
    dimension?: string;
  }): Promise<Metric[]> {
    let results = this.metrics;

    if (filters?.metric) {
      results = results.filter(m => m.metric === filters.metric);
    }
    if (filters?.startDate) {
      results = results.filter(m => m.date >= filters.startDate!);
    }
    if (filters?.endDate) {
      results = results.filter(m => m.date <= filters.endDate!);
    }
    if (filters?.dimension) {
      results = results.filter(m => m.dimension === filters.dimension);
    }

    return results;
  }

  async recordMetric(metric: Omit<Metric, 'date'>): Promise<Metric> {
    const newMetric: Metric = {
      ...metric,
      date: new Date()
    };
    this.metrics.push(newMetric);
    return newMetric;
  }

  async getReport(startDate: Date, endDate: Date): Promise<AnalyticsReport> {
    const eventsInPeriod = this.events.filter(
      e => e.timestamp >= startDate && e.timestamp <= endDate
    );

    const uniqueUsers = new Set(eventsInPeriod.map(e => e.userId)).size;
    
    const eventCounts: Record<string, number> = {};
    eventsInPeriod.forEach(e => {
      eventCounts[e.event] = (eventCounts[e.event] || 0) + 1;
    });

    const topEvents = Object.entries(eventCounts)
      .map(([event, count]) => ({ event, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      period: { start: startDate, end: endDate },
      metrics: this.metrics.filter(m => m.date >= startDate && m.date <= endDate),
      summary: {
        totalEvents: eventsInPeriod.length,
        uniqueUsers,
        topEvents
      }
    };
  }

  async getActiveUsers(startDate: Date, endDate: Date): Promise<number> {
    const events = this.events.filter(
      e => e.timestamp >= startDate && e.timestamp <= endDate
    );
    return new Set(events.map(e => e.userId)).size;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

export const analyticsEngine = new AnalyticsEngine();
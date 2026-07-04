// PV Core - Main entry point
// This file exports all core services

// Core Services
export { AuthenticationService } from './authentication/index.js';
export { AuthorizationService } from './authorization/index.js';
export { ObjectEngine } from './object-engine/index.js';
export { AppRegistry } from './app-registry/index.js';

// Platform Services
export { APIGateway } from './api-gateway/index.js';
export { AIGateway } from './ai-gateway/index.js';
export { EventBus, EventTypes } from './event-bus/index.js';
export { NotificationEngine } from './notification-engine/index.js';
export { SearchEngine } from './search-engine/index.js';
export { AnalyticsEngine } from './analytics-engine/index.js';
export { FileManager } from './file-manager/index.js';

// Global instances
export { eventBus } from './event-bus/index.js';
export { notificationEngine } from './notification-engine/index.js';
export { searchEngine } from './search-engine/index.js';
export { analyticsEngine } from './analytics-engine/index.js';
export { fileManager } from './file-manager/index.js';

// Re-export types
export type {
  User,
  AuthToken,
  Permission,
  Role,
  ObjectType,
  ObjectField,
  AppDefinition,
  AIConfig,
  PlatformEvent,
  EventHandler,
  NotificationChannel,
  NotificationTemplate,
  Notification,
  NotificationPreferences,
  SearchResult,
  SearchFilters,
  SearchIndex,
  AnalyticsEvent,
  AnalyticsMetrics,
  UserAnalytics,
  FileMetadata,
  FileUploadOptions,
  Folder,
  ApiResponse
} from './types/index.js';


/**
 * PV Core - Shared Type Definitions
 * Centralized types for the entire platform
 */

// ============================================================================
// Authentication & Authorization Types
// ============================================================================

export interface User {
  _id?: string;
  email: string;
  username: string;
  password: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar: string;
    bio: string;
  };
  oauth?: {
    google?: { id: string; email: string };
    github?: { id: string; username: string };
  };
  settings: {
    twoFactorEnabled: boolean;
    emailNotifications: boolean;
    theme: 'light' | 'dark';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthToken {
  token: string;
  refreshToken: string;
  expiresIn: string;
}

export interface Permission {
  id: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: Date;
}

export interface UserRole {
  userId: string;
  roleId: string;
  scope: 'global' | 'organization' | 'project';
  scopeId?: string;
}

// ============================================================================
// API Gateway Types
// ============================================================================

export interface RouteConfig {
  path: string;
  target: string;
  methods: string[];
  rateLimit?: {
    windowMs: number;
    max: number;
  };
}

export interface GatewayConfig {
  routes?: RouteConfig[];
  defaultRateLimit?: {
    windowMs: number;
    max: number;
  };
}

// ============================================================================
// AI Gateway Types
// ============================================================================

export interface AIConfig {
  provider: 'gemini' | 'openai' | 'claude';
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
  topP?: number;
  topK?: number;
}

export interface AIProvider {
  name: string;
  complete(prompt: string, config: AIConfig): Promise<string>;
  stream(prompt: string, config: AIConfig): AsyncIterable<string>;
  getModels(): Promise<string[]>;
}

export interface AIUsage {
  userId: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  timestamp: Date;
}

export interface AICache {
  prompt: string;
  provider: string;
  model: string;
  response: string;
  hash: string;
  expiresAt: Date;
  createdAt: Date;
}

// ============================================================================
// Object Engine Types
// ============================================================================

export interface ObjectField {
  name: string;
  displayName: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'checkbox' | 'select' | 'multiselect' | 'file' | 'relationship';
  required: boolean;
  unique: boolean;
  default?: any;
  options?: any[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  helpText?: string;
}

export interface ObjectRelationship {
  name: string;
  displayName: string;
  referenceTo: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

export interface ObjectPermissions {
  create: string[];
  read: string[];
  update: string[];
  delete: string[];
}

export interface ObjectType {
  id: string;
  name: string;
  displayName: string;
  plural: string;
  description: string;
  icon: string;
  fields: ObjectField[];
  relationships: ObjectRelationship[];
  permissions: ObjectPermissions;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomObject {
  _id?: string;
  objectType: string;
  [key: string]: any;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  metadata: {
    version: number;
    tags: string[];
  };
}

// ============================================================================
// App Registry Types
// ============================================================================

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

// ============================================================================
// Event Bus Types
// ============================================================================

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

// ============================================================================
// Notification Engine Types
// ============================================================================

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

// ============================================================================
// Search Engine Types
// ============================================================================

export interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
  url: string;
  metadata: Record<string, any>;
  score: number;
}

export interface SearchFilters {
  types?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  userId?: string;
  tags?: string[];
}

export interface SearchIndex {
  id: string;
  type: string;
  title: string;
  description: string;
  content: string;
  url: string;
  userId: string;
  tags: string[];
  metadata: Record<string, any>;
  indexedAt: Date;
}

// ============================================================================
// Analytics Engine Types
// ============================================================================

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

// ============================================================================
// File Manager Types
// ============================================================================

export interface FileMetadata {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  folder: string;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface FileUploadOptions {
  folder?: string;
  tags?: string[];
  transform?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: number;
  };
  generateThumbnail?: boolean;
}

export interface Folder {
  name: string;
  path: string;
  userId: string;
  fileCount: number;
  createdAt: Date;
}

// ============================================================================
// Common API Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  metadata?: Record<string, any>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  timestamp: Date;
  requestId: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
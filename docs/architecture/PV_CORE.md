# PV Core Specification

## Overview

**PV Core** is the shared infrastructure that every application inherits. It handles authentication, authorization, object management, API routing, AI integration, and more.

---

## Core Services Specification

### 1. Authentication Service

**Responsibilities:**
- User registration and login
- JWT token generation and validation
- OAuth provider integration
- Session management
- Password management

**Database Schema:**
```typescript
// users collection
{
  _id: ObjectId,
  email: string,
  username: string,
  password: string, // bcrypted
  profile: {
    firstName: string,
    lastName: string,
    avatar: string,
    bio: string
  },
  oauth: {
    google?: {
      id: string,
      email: string
    },
    github?: {
      id: string,
      username: string
    }
  },
  settings: {
    twoFactorEnabled: boolean,
    emailNotifications: boolean,
    theme: 'light' | 'dark'
  },
  createdAt: Date,
  updatedAt: Date
}

// sessions collection
{
  _id: ObjectId,
  userId: ObjectId,
  token: string,
  refreshToken: string,
  expiresAt: Date,
  userAgent: string,
  ipAddress: string,
  createdAt: Date
}
```

**API Endpoints:**
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
GET    /api/v1/auth/oauth/google
GET    /api/v1/auth/oauth/github
GET    /api/v1/auth/me (current user)
PUT    /api/v1/auth/me (update profile)
```

---

### 2. Authorization Service

**Responsibilities:**
- Role-based access control (RBAC)
- Permission management
- Object-level permissions
- Feature flags

**Database Schema:**
```typescript
// roles collection
{
  _id: ObjectId,
  name: string, // 'admin', 'user', 'viewer', etc.
  description: string,
  permissions: string[], // ['users:create', 'users:read', etc.]
  createdAt: Date
}

// user_roles collection
{
  _id: ObjectId,
  userId: ObjectId,
  roleId: ObjectId,
  scope: 'global' | 'organization' | 'project',
  scopeId?: ObjectId,
  createdAt: Date
}

// permissions collection
{
  _id: ObjectId,
  resource: string, // 'users', 'projects', 'clients'
  action: string, // 'create', 'read', 'update', 'delete'
  description: string
}

// object_permissions collection
{
  _id: ObjectId,
  objectType: string,
  objectId: ObjectId,
  userId: ObjectId,
  permissions: string[]
}
```

**Middleware:**
```typescript
// Check if user has permission
async function requirePermission(resource: string, action: string) {
  return async (req, res, next) => {
    const user = req.user;
    const hasPermission = await authzService.hasPermission(
      user.id,
      resource,
      action
    );
    
    if (!hasPermission) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
}

// Usage:
router.post(
  '/users',
  authenticate,
  requirePermission('users', 'create'),
  userController.create
);
```

---

### 3. App Registry Service

**Responsibilities:**
- Register and discover applications
- Manage app metadata
- Handle app initialization
- Track app integrations

**Database Schema:**
```typescript
// apps collection
{
  _id: ObjectId,
  name: string, // 'portfolio', 'crm', 'buildhub'
  slug: string, // 'portfolio'
  displayName: string, // 'Portfolio'
  description: string,
  icon: string, // URL
  version: string,
  status: 'active' | 'inactive' | 'maintenance',
  
  endpoints: {
    frontend: string, // 'https://portfolio.example.com'
    backend: string, // 'https://api.portfolio.example.com'
    websocket?: string
  },
  
  metadata: {
    author: string,
    homepage: string,
    repository: string
  },
  
  features: {
    hasDatabase: boolean,
    hasCloudinaryFolder: boolean,
    requiresSubscription: boolean
  },
  
  permissions: string[], // Permissions this app can grant
  
  createdAt: Date,
  updatedAt: Date
}

// app_installations collection
{
  _id: ObjectId,
  userId: ObjectId,
  appId: ObjectId,
  config: {}, // App-specific configuration
  enabled: boolean,
  permissions: string[],
  installDate: Date
}
```

**API Endpoints:**
```
GET    /api/v1/apps (list all registered apps)
GET    /api/v1/apps/:slug (get app details)
POST   /api/v1/apps/:slug/install (install app for user)
POST   /api/v1/apps/:slug/uninstall (uninstall app for user)
GET    /api/v1/apps/:slug/config (get app configuration)
PUT    /api/v1/apps/:slug/config (update app configuration)
```

---

### 4. Object Manager Service

**Responsibilities:**
- Define custom object types
- Store object definitions
- Manage fields and relationships
- Generate APIs and UI

**Database Schema:**
```typescript
// object_types collection
{
  _id: ObjectId,
  appId: ObjectId,
  name: string, // 'Project', 'Portfolio', 'Client'
  displayName: string,
  plural: string,
  description: string,
  icon: string,
  
  fields: [
    {
      name: string,
      displayName: string,
      type: 'text' | 'textarea' | 'number' | 'date' | 'checkbox' | 'select' | 'multiselect' | 'file' | 'relationship',
      required: boolean,
      unique: boolean,
      default?: any,
      options?: any[], // for select/multiselect
      validation?: {
        min?: number,
        max?: number,
        pattern?: string
      },
      helpText?: string
    }
  ],
  
  relationships: [
    {
      name: string,
      displayName: string,
      referenceTo: string, // other object type name
      type: 'one-to-one' | 'one-to-many' | 'many-to-many'
    }
  ],
  
  permissions: {
    create: string[], // roles that can create
    read: string[],
    update: string[],
    delete: string[]
  },
  
  createdAt: Date,
  updatedAt: Date
}

// custom_objects (dynamic collection)
{
  _id: ObjectId,
  objectType: string, // name of the object type
  [fieldName]: any, // dynamic fields
  relationships: {},
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  metadata: {
    version: number,
    tags: string[]
  }
}
```

**Auto-Generated APIs:**

For each custom object:
```
POST   /api/v1/objects/:objectType
GET    /api/v1/objects/:objectType
GET    /api/v1/objects/:objectType/:id
PUT    /api/v1/objects/:objectType/:id
DELETE /api/v1/objects/:objectType/:id
PATCH  /api/v1/objects/:objectType/:id
GET    /api/v1/objects/:objectType/search?q=query
```

---

### 5. API Gateway Service

**Responsibilities:**
- Route requests to appropriate services
- Rate limiting
- Request/response transformation
- Logging and monitoring

**Architecture:**
```
Client Request
    ↓
[CORS Middleware]
    ↓
[Authentication Middleware]
    ↓
[Authorization Middleware]
    ↓
[Rate Limiting Middleware]
    ↓
[Request Logging]
    ↓
[Service Router]
    │
    ├→ Auth Service
    ├→ App Registry Service
    ├→ Object Manager Service
    ├→ AI Gateway Service
    ├→ Search Service
    ├→ App-specific Services
    │
[Response Transformation]
    ↓
[Response Logging]
    ↓
Client Response
```

**Configuration:**
```typescript
// gateway.config.ts
export const routes = [
  {
    path: '/api/v1/auth',
    service: 'auth-service',
    rateLimit: '100/hour'
  },
  {
    path: '/api/v1/apps',
    service: 'app-registry',
    rateLimit: '1000/hour'
  },
  {
    path: '/api/v1/objects',
    service: 'object-manager',
    rateLimit: '5000/hour'
  },
  {
    path: '/api/v1/search',
    service: 'search-service',
    rateLimit: '2000/hour'
  },
  {
    path: '/api/v1/:appId',
    service: 'app-router',
    rateLimit: '10000/hour'
  }
];
```

---

### 6. AI Gateway Service

**Responsibilities:**
- Route AI requests to configured provider
- Manage AI configuration
- Cache AI responses
- Track AI usage

**Database Schema:**
```typescript
// ai_config collection
{
  _id: ObjectId,
  userId: ObjectId,
  provider: 'gemini' | 'openai' | 'claude',
  model: string,
  temperature: number,
  maxTokens: number,
  systemPrompt: string,
  updatedAt: Date
}

// ai_usage collection
{
  _id: ObjectId,
  userId: ObjectId,
  provider: string,
  model: string,
  inputTokens: number,
  outputTokens: number,
  cost: number,
  timestamp: Date
}

// ai_cache collection
{
  _id: ObjectId,
  prompt: string,
  provider: string,
  model: string,
  response: string,
  hash: string, // hash of prompt for quick lookup
  expiresAt: Date,
  createdAt: Date
}
```

**API Endpoints:**
```
POST   /api/v1/ai/chat (send message)
POST   /api/v1/ai/generate (generate content)
GET    /api/v1/ai/providers (list available providers)
GET    /api/v1/ai/config (get current config)
PUT    /api/v1/ai/config (update config)
GET    /api/v1/ai/usage (get usage stats)
```

---

### 7. Search Service

**Responsibilities:**
- Index documents
- Full-text search
- Faceted filtering
- Real-time updates

**Implementation:**
```typescript
// Uses Elasticsearch or similar
// Index all objects across all apps

// Search query
{
  q: "search query",
  filters: {
    objectType: 'Project',
    app: 'portfolio',
    createdAfter: '2024-01-01'
  },
  limit: 20,
  offset: 0
}

// Response
{
  total: 150,
  results: [
    {
      id: '...',
      objectType: 'Project',
      app: 'portfolio',
      title: 'Project Title',
      description: '...',
      score: 0.95
    }
  ],
  facets: {
    objectType: { Project: 50, Client: 30 },
    app: { portfolio: 40, crm: 40 }
  }
}
```

---

### 8. Analytics Engine

**Responsibilities:**
- Track user events
- Generate reports
- Calculate metrics
- Create visualizations

**Event Types:**
```typescript
// User events
'user:login'
'user:logout'
'user:signup'

// App events
'app:installed'
'app:uninstalled'
'app:accessed'

// Object events
'object:created'
'object:updated'
'object:deleted'
'object:viewed'

// AI events
'ai:request'
'ai:completion'
'ai:error'

// Custom events
'custom:*'
```

**Database Schema:**
```typescript
// events collection
{
  _id: ObjectId,
  userId: ObjectId,
  event: string, // 'user:login'
  app?: string,
  objectType?: string,
  objectId?: ObjectId,
  metadata: {},
  timestamp: Date
}

// analytics collection
{
  _id: ObjectId,
  date: Date,
  metric: string, // 'daily_active_users', 'api_calls'
  value: number,
  dimension?: string // 'app_name', 'user_id'
}
```

---

### 9. Notification Engine

**Responsibilities:**
- Send notifications
- Manage notification preferences
- Track notification history

**Database Schema:**
```typescript
// notifications collection
{
  _id: ObjectId,
  userId: ObjectId,
  type: 'email' | 'sms' | 'push' | 'in_app',
  subject: string,
  body: string,
  actionUrl?: string,
  read: boolean,
  readAt?: Date,
  createdAt: Date,
  sentAt?: Date
}

// notification_preferences collection
{
  _id: ObjectId,
  userId: ObjectId,
  channel: 'email' | 'sms' | 'push',
  events: {
    'app:installed': boolean,
    'object:mentioned': boolean,
    'ai:completed': boolean,
    // ... more events
  }
}
```

---

## Integration Pattern

All services follow this pattern:

```typescript
// Service interface
interface Service {
  // Initialize service
  init(): Promise<void>;
  
  // Perform operation
  execute(action: string, params: any): Promise<any>;
  
  // Cleanup
  destroy(): Promise<void>;
}

// Concrete implementation
class AuthenticationService implements Service {
  async init() {
    // Initialize MongoDB connection, etc.
  }
  
  async execute(action: string, params: any) {
    switch (action) {
      case 'login':
        return this.login(params);
      case 'register':
        return this.register(params);
      // ...
    }
  }
  
  async destroy() {
    // Cleanup resources
  }
}

// Usage in API Gateway
const authService = new AuthenticationService();
await authService.init();

router.post('/auth/login', async (req, res) => {
  const result = await authService.execute('login', req.body);
  res.json(result);
});
```

---

## Next Steps

1. Implement Authentication Service
2. Implement Authorization Service
3. Build API Gateway
4. Implement App Registry
5. Implement Object Manager
6. Add AI Gateway
7. Add Search, Analytics, Notifications

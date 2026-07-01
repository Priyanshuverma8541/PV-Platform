# PV Core

Core platform engine for PV Platform - provides shared infrastructure for all applications.

## Overview

PV Core is the backbone of the PV Platform ecosystem, providing essential services that all applications inherit:

- **Authentication** - JWT, OAuth (Google, GitHub)
- **Authorization** - Role-based access control (RBAC)
- **Object Engine** - Dynamic object management with custom fields
- **App Registry** - Application discovery and management
- **API Gateway** - Request routing and rate limiting
- **AI Gateway** - Multi-provider AI integration
- **Search Engine** - Full-text search across all apps
- **Analytics Engine** - Event tracking and reporting
- **Notification Engine** - Multi-channel notifications
- **Theme Engine** - Unified design system
- **File Manager** - Cloudinary integration
- **Marketplace** - Extension and integration marketplace

## Architecture

```
pv-core/
├── authentication/     # User authentication & JWT
├── authorization/      # RBAC & permissions
├── object-engine/      # Dynamic object management
├── app-registry/       # App discovery & management
├── api-gateway/        # API routing & rate limiting
├── ai-gateway/         # AI provider integration
├── search-engine/      # Full-text search
├── analytics-engine/   # Event tracking & metrics
├── notification-engine/# Multi-channel notifications
├── theme-engine/       # Design system & theming
├── file-manager/       # File upload & management
└── marketplace/        # Extension marketplace
```

## Modules

### 1. Authentication Service

**Location:** `src/authentication/`

**Features:**
- Password hashing with bcrypt
- JWT token generation and validation
- Refresh token support
- User creation and validation
- OAuth support (Google, GitHub)

**Usage:**
```typescript
import { authService } from 'pv-core';

// Hash password
const hashedPassword = await authService.hashPassword('userPassword');

// Generate tokens
const tokens = authService.generateToken(userId, email);

// Verify token
const payload = authService.verifyToken(token);
```

### 2. Authorization Service

**Location:** `src/authorization/`

**Features:**
- Role-based access control
- Permission management
- User role assignment
- Scope-based permissions (global, organization, project)

**Usage:**
```typescript
import { authzService } from 'pv-core';

// Create role
const role = await authzService.createRole({
  name: 'admin',
  description: 'Administrator',
  permissions: ['users:create', 'users:read', 'users:update', 'users:delete']
});

// Assign role
await authzService.assignRole(userId, role.id, 'global');

// Check permission
const canEdit = await authzService.hasPermission(userId, 'users', 'update');
```

### 3. Object Engine

**Location:** `src/object-engine/`

**Features:**
- Dynamic object type definition
- Custom fields and relationships
- CRUD operations on objects
- Object search
- Version tracking

**Usage:**
```typescript
import { objectEngine } from 'pv-core';

// Define object type
const projectType = await objectEngine.defineObjectType({
  name: 'Project',
  displayName: 'Project',
  plural: 'Projects',
  description: 'User projects',
  icon: 'folder',
  fields: [
    { name: 'title', displayName: 'Title', type: 'text', required: true },
    { name: 'description', displayName: 'Description', type: 'textarea', required: true }
  ],
  relationships: [],
  permissions: { create: ['admin'], read: ['*'], update: ['admin'], delete: ['admin'] }
});

// Create object
const project = await objectEngine.createObject(projectType.id, {
  title: 'My Project',
  description: 'Project description'
}, userId);
```

### 4. App Registry

**Location:** `src/app-registry/`

**Features:**
- App registration and discovery
- App metadata management
- App installation tracking
- Permission delegation

**Usage:**
```typescript
import { appRegistry } from 'pv-core';

// Register app
const app = await appRegistry.registerApp({
  name: 'Portfolio',
  slug: 'portfolio',
  displayName: 'Portfolio',
  description: 'Public portfolio',
  icon: '/icons/portfolio.png',
  version: '1.0.0',
  status: 'active',
  endpoints: {
    frontend: 'http://localhost:5173',
    backend: 'http://localhost:3000'
  },
  metadata: {
    author: 'PV Platform',
    homepage: 'https://example.com',
    repository: 'https://github.com/...'
  },
  features: {
    hasDatabase: true,
    hasCloudinaryFolder: true,
    requiresSubscription: false
  },
  permissions: []
});

// Install app for user
await appRegistry.installApp(userId, app.id);
```

### 5. API Gateway

**Location:** `src/api-gateway/`

**Features:**
- Route configuration
- Rate limiting
- Request routing
- Service discovery

**Usage:**
```typescript
import { apiGateway } from 'pv-core';

// Register route
apiGateway.registerRoute({
  path: '/api/auth',
  target: 'http://auth-service:3001',
  methods: ['POST', 'GET'],
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100
  }
});

// Get route
const route = apiGateway.getRoute('/api/auth');
```

### 6. AI Gateway

**Location:** `src/ai-gateway/`

**Features:**
- Multi-provider support (Gemini, OpenAI, Claude)
- Response caching
- Usage tracking
- Configuration management

**Usage:**
```typescript
import { aiGateway } from 'pv-core';

// Register provider
aiGateway.registerProvider('gemini', new GeminiProvider());

// Complete prompt
const response = await aiGateway.complete('Hello, world!', {
  provider: 'gemini',
  config: {
    model: 'gemini-pro',
    temperature: 0.7,
    maxTokens: 100
  }
});

// Stream response
for await (const chunk of aiGateway.stream('Tell me a story')) {
  console.log(chunk);
}
```

### 7. Search Engine

**Location:** `src/search-engine/`

**Features:**
- Full-text search
- Faceted filtering
- Real-time indexing
- Cross-app search

**Usage:**
```typescript
import { searchEngine } from 'pv-core';

// Index document
await searchEngine.index('Project', 'portfolio', {
  id: '123',
  title: 'My Project',
  description: 'A cool project',
  tags: ['react', 'node']
});

// Search
const results = await searchEngine.search('react', {
  objectType: 'Project',
  app: 'portfolio'
});
```

### 8. Analytics Engine

**Location:** `src/analytics-engine/`

**Features:**
- Event tracking
- Metric recording
- Report generation
- Active user tracking

**Usage:**
```typescript
import { analyticsEngine } from 'pv-core';

// Track event
await analyticsEngine.trackEvent({
  userId: 'user123',
  event: 'project:created',
  app: 'portfolio',
  objectType: 'Project',
  objectId: 'project123',
  metadata: { title: 'My Project' }
});

// Get report
const report = await analyticsEngine.getReport(
  new Date('2024-01-01'),
  new Date('2024-12-31')
);
```

### 9. Notification Engine

**Location:** `src/notification-engine/`

**Features:**
- Multi-channel notifications (email, SMS, push, in-app)
- Notification preferences
- Template management
- Read/unread tracking

**Usage:**
```typescript
import { notificationEngine } from 'pv-core';

// Send notification
await notificationEngine.send({
  userId: 'user123',
  type: 'in_app',
  subject: 'New message',
  body: 'You have a new message',
  read: false
});

// Get notifications
const notifications = await notificationEngine.getNotifications('user123', true); // unread only
```

### 10. Theme Engine

**Location:** `src/theme-engine/`

**Features:**
- Theme management
- Light/dark mode
- User customizations
- Default themes

**Usage:**
```typescript
import { themeEngine } from 'pv-core';

// Get active theme
const theme = await themeEngine.getActiveTheme('user123');

// Set user theme
await themeEngine.setUserTheme('user123', 'dark-default', {
  colors: {
    primary: '#FF0000'
  }
});
```

### 11. File Manager

**Location:** `src/file-manager/`

**Features:**
- File upload tracking
- Folder organization
- File search
- Storage usage tracking

**Usage:**
```typescript
import { fileManager } from 'pv-core';

// Upload file
const file = await fileManager.uploadFile({
  userId: 'user123',
  filename: 'abc123.jpg',
  originalName: 'photo.jpg',
  mimeType: 'image/jpeg',
  size: 102400,
  url: 'https://res.cloudinary.com/...',
  cloudinaryPublicId: 'pv-platform/user123/abc123',
  folder: 'projects',
  tags: ['portfolio', 'project1']
});

// Get files
const files = await fileManager.getFiles('user123', 'projects');
```

### 12. Marketplace

**Location:** `src/marketplace/`

**Features:**
- Extension publishing
- Extension discovery
- Installation management
- Reviews and ratings

**Usage:**
```typescript
import { marketplace } from 'pv-core';

// Publish extension
const extension = await marketplace.publishExtension({
  name: 'Analytics Dashboard',
  slug: 'analytics-dashboard',
  description: 'Advanced analytics',
  version: '1.0.0',
  author: 'PV Platform',
  icon: '/icons/analytics.png',
  category: 'Analytics',
  tags: ['analytics', 'dashboard'],
  price: 0,
  manifest: {}
});

// Install extension
await marketplace.installExtension('user123', extension.id, '1.0.0');
```

## Installation

```bash
pnpm install
```

## Development

```bash
# Build all modules
pnpm build

# Development mode
pnpm dev
```

## Integration with Apps

All PV Platform apps can import and use PV Core services:

```typescript
import { 
  authService,
  authzService,
  objectEngine,
  appRegistry,
  aiGateway,
  searchEngine,
  analyticsEngine,
  notificationEngine,
  themeEngine,
  fileManager,
  marketplace
} from 'pv-core';
```

## Configuration

PV Core services are configured via environment variables:

```env
JWT_SECRET=your-jwt-secret
MONGODB_URL=your-mongodb-url
CLOUDINARY_CLOUD_NAME=your-cloud-name
GEMINI_API_KEY=your-gemini-key
```

## Architecture Principles

1. **Shared Infrastructure** - All apps inherit these services
2. **Modular Design** - Each service is independent
3. **Configuration Over Hardcoding** - Everything configurable
4. **Type Safety** - Full TypeScript support
5. **Extensibility** - Easy to add new providers and features

## Next Steps

- [ ] Implement database persistence (MongoDB)
- [ ] Add Redis caching
- [ ] Implement WebSocket support
- [ ] Add monitoring and logging
- [ ] Create REST API endpoints
- [ ] Add unit and integration tests

## License

UNLICENSED - All rights reserved © 2024
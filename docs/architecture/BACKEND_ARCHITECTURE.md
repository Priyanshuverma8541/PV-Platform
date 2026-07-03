# PV Platform Backend Architecture

## Overview

PV Platform backend is a **Modular Monolith** designed to evolve into microservices. It follows Domain-Driven Design, Clean Architecture, and Event-Driven principles.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (Layer 1)                     │
│  • Single entry point                                        │
│  • Authentication & Authorization                            │
│  • Rate Limiting & Request Validation                        │
│  • Service Routing                                           │
│  • Logging & Monitoring                                      │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│ Platform       │  │ Application │  │ Infrastructure   │
│ Services       │  │ Services    │  │                  │
│ (Layer 1)      │  │ (Layer 2)   │  │ (Layer 3)        │
│                │  │             │  │                  │
│ • Auth         │  │ • Portfolio │  │ • MongoDB        │
│ • AI           │  │ • Career    │  │ • Redis          │
│ • Search       │  │ • CRM       │  │ • Cloudinary     │
│ • Notification │  │ • Learning  │  │ • Event Bus      │
│ • Analytics    │  │ • Finance   │  │ • File Storage   │
│ • Media        │  │ • Marketplace│ │ • Cache          │
│ • Event Bus    │  │ • Blog      │  │                  │
└────────────────┘  └─────────────┘  └──────────────────┘
```

## Core Services (pv-core)

### 1. Authentication Service
- JWT-based authentication
- Refresh tokens
- Password reset
- Email verification
- OAuth (Google, GitHub)
- Role-based access control (RBAC)
- Session management
- Audit logs

### 2. Authorization Service
- Permission-based access control
- Role management
- Resource-level permissions
- Scope-based access (global, organization, project)

### 3. AI Gateway
- Multi-provider AI abstraction (Gemini, OpenAI, Claude)
- Unified AI interface for all applications
- Usage tracking and analytics
- Prompt management
- Conversation context
- Streaming responses

### 4. Event Bus
- Internal event-driven architecture
- Loose coupling between services
- Event sourcing
- Async communication
- Event history and replay

### 5. Notification Engine
- Multi-channel notifications (Email, SMS, Push, Slack, Discord, WhatsApp)
- Template management
- Scheduling
- Retry mechanism
- Delivery tracking
- User preferences

### 6. Search Engine
- Global search across all platform data
- Full-text search
- Filtering and faceting
- Autocomplete suggestions
- Relevance scoring

### 7. Analytics Engine
- Event tracking
- User analytics
- Platform metrics
- AI usage tracking
- Revenue analytics
- Timeline reports

### 8. File Manager
- Cloudinary integration
- File upload/download
- Image optimization
- Thumbnail generation
- Folder organization
- Signed URLs
- Storage statistics

### 9. Object Engine
- Dynamic object type definition
- Custom object creation
- Field validation
- Relationships
- Permissions

### 10. App Registry
- Application registration
- Installation management
- Feature flags
- Permission management

## API Gateway Features

### Security
- Helmet.js for security headers
- CORS configuration
- JWT authentication
- Rate limiting
- Request validation with Zod
- Input sanitization

### Routing
- API versioning (/api/v1)
- Service discovery
- Dynamic route registration
- Health checks
- Load balancing ready

### Observability
- Structured logging (Winston)
- Request ID tracking
- Performance monitoring
- Error tracking
- Analytics events

## Database Architecture

### Shared Collections (MongoDB)
- `users` - User accounts and profiles
- `roles` - Role definitions
- `permissions` - Permission definitions
- `user_roles` - User-role mappings
- `settings` - Platform settings
- `notifications` - Notification history
- `ai_usage` - AI usage tracking
- `ai_chats` - AI conversation history
- `ai_feedback` - AI feedback
- `search_indexes` - Search index
- `analytics_events` - Analytics events
- `files` - File metadata

### Application-Specific Collections
Each application service owns its collections:
- `projects` - Portfolio projects
- `experiences` - Career experiences
- `leads` - CRM leads
- `courses` - Learning courses
- `transactions` - Finance transactions
- `products` - Marketplace products
- `posts` - Blog posts
- `builds` - BuildHub projects

## Event-Driven Architecture

### Event Types
```typescript
// User Events
USER_REGISTERED
USER_LOGGED_IN
USER_UPDATED
USER_DELETED

// Auth Events
PASSWORD_RESET_REQUESTED
PASSWORD_RESET_COMPLETED
EMAIL_VERIFIED

// AI Events
AI_RESPONSE_GENERATED
AI_USAGE_LIMIT_REACHED

// Notification Events
NOTIFICATION_SENT
NOTIFICATION_FAILED

// Media Events
MEDIA_UPLOADED
MEDIA_DELETED

// Application Events
APP_INSTALLED
APP_UNINSTALLED

// Business Events
PROJECT_CREATED
LEAD_CREATED
COURSE_COMPLETED
PAYMENT_RECEIVED
```

### Event Flow
1. Application service publishes event
2. Event bus receives and validates event
3. Event bus distributes to registered handlers
4. Platform services consume events
5. Handlers execute asynchronously
6. Errors are logged but don't block other handlers

## Configuration Management

### Environment Variables
All configuration is environment-based:
- Service URLs
- API keys
- Database connections
- Feature flags
- Rate limits
- Security settings

### Configuration Hierarchy
1. Environment variables (highest priority)
2. .env files
3. Default values (lowest priority)

## Security Best Practices

### Authentication
- JWT with short expiration (7 days)
- Refresh tokens (30 days)
- Secure HTTP-only cookies (optional)
- Token rotation

### Authorization
- Role-based access control
- Resource-level permissions
- Scope validation
- Permission caching

### Data Protection
- Password hashing (bcrypt, 12 rounds)
- Input validation (Zod)
- SQL injection prevention (Mongoose)
- XSS protection (Helmet)
- CSRF protection
- Rate limiting

### API Security
- HTTPS only in production
- CORS configuration
- Request size limits
- API versioning
- Request ID tracking

## Logging Strategy

### Log Levels
- ERROR: System errors, failures
- WARN: Warnings, retries
- INFO: Important events, requests
- DEBUG: Detailed debugging info

### Log Format
```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "level": "info",
  "message": "Request completed",
  "requestId": "uuid",
  "method": "POST",
  "path": "/api/v1/auth/login",
  "statusCode": 200,
  "duration": "45ms"
}
```

### What to Log
- Authentication attempts
- Authorization failures
- API requests and responses
- Errors and exceptions
- AI usage
- Database queries (slow)
- External API calls
- Webhook events

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"],
  "timestamp": "2024-01-01T00:00:00.000Z",
  "requestId": "uuid"
}
```

### Error Categories
- 400: Validation errors
- 401: Authentication errors
- 403: Authorization errors
- 404: Not found
- 429: Rate limit exceeded
- 500: Internal server error
- 503: Service unavailable

## Deployment Strategy

### Phase 1: Core Services
1. API Gateway
2. Authentication Service
3. Media Service
4. AI Service

### Phase 2: Platform Services
5. Notification Service
6. Search Service
7. Analytics Service

### Phase 3: Application Services
8. Portfolio Service
9. Career Service
10. Resume Service
11. Learning Service

### Phase 4: Business Services
12. CRM Service
13. Finance Service
14. Marketplace Service
15. Blog Service

### Phase 5: Advanced Services
16. BuildHub Service
17. Future SaaS Applications

## Development Guidelines

### Code Organization
```
service/
├── src/
│   ├── config/         # Configuration
│   ├── controllers/    # Request handlers
│   ├── routes/         # Route definitions
│   ├── services/       # Business logic
│   ├── repositories/   # Data access
│   ├── models/         # Data models
│   ├── middleware/     # Express middleware
│   ├── validators/     # Input validation
│   ├── events/         # Event handlers
│   ├── interfaces/     # TypeScript interfaces
│   ├── dto/            # Data transfer objects
│   ├── constants/      # Constants
│   ├── errors/         # Custom errors
│   ├── utils/          # Utilities
│   ├── tests/          # Tests
│   ├── app.ts          # Express app
│   └── server.ts       # Server entry
```

### Best Practices
1. **Never** place business logic in controllers
2. **Never** access MongoDB directly from controllers
3. **Never** duplicate logic across services
4. **Always** use dependency injection where appropriate
5. **Always** validate input
6. **Always** handle errors gracefully
7. **Always** log important events
8. **Always** use async/await
9. **Always** follow SOLID principles
10. **Always** write tests

## Performance Considerations

### Caching Strategy
- Redis for session storage
- In-memory caching for frequent queries
- CDN for static assets
- Browser caching headers

### Database Optimization
- Indexed queries
- Connection pooling
- Query optimization
- Aggregation pipelines

### API Optimization
- Response compression
- Pagination
- Field selection
- Batch operations
- WebSocket for real-time

## Monitoring and Observability

### Metrics to Track
- Request rate
- Response time
- Error rate
- CPU and memory usage
- Database query time
- Cache hit rate
- AI usage and costs
- User activity

### Health Checks
- Service health endpoint
- Database connectivity
- External service availability
- Resource utilization

## Scalability Plan

### Current: Modular Monolith
- Single codebase
- Shared database
- In-process communication

### Future: Microservices
- Separate deployments
- Dedicated databases
- Message queue for communication
- Service mesh
- Distributed tracing

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Cache**: Redis
- **Queue**: Event Bus (internal)
- **File Storage**: Cloudinary
- **AI**: Gemini, OpenAI, Claude

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes (future)
- **Deployment**: Render, Fly.io
- **Monitoring**: Winston (logging)
- **API Docs**: OpenAPI (future)

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm
- MongoDB Atlas account
- Cloudinary account
- AI provider API keys

### Installation
```bash
# Install dependencies
pnpm install

# Build pv-core
pnpm --filter pv-core build

# Start services
pnpm --filter api-gateway dev
pnpm --filter auth-service dev
pnpm --filter ai-service dev
```

### Environment Setup
Copy `.env.example` to `.env` and configure:
- Database URL
- JWT secret
- OAuth credentials
- AI provider keys
- Service URLs
- Cloudinary credentials

## Contributing

### Branch Strategy
- `main` - Production
- `develop` - Development
- `feature/*` - New features
- `hotfix/*` - Bug fixes

### Commit Convention
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

## License

Proprietary - PV Platform
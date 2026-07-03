# PV Platform Backend

Production-ready backend architecture for PV Platform - A Personal Operating System.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (Port 3000)                   │
│  • Single entry point                                        │
│  • Authentication & Authorization                            │
│  • Rate Limiting & Validation                                │
│  • Service Routing                                           │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│ Platform       │  │ Application │  │ Infrastructure   │
│ Services       │  │ Services    │  │                  │
│                │  │             │  │                  │
│ • Auth (4000)  │  │ • Portfolio │  │ • MongoDB        │
│ • AI (5000)    │  │ • Career    │  │ • Cloudinary     │
│ • Media (5001) │  │ • CRM       │  │ • Event Bus      │
│ • Notify (5002)│  │ • Learning  │  │                  │
│ • Search (5003)│  │ • Finance   │  │                  │
│ • Analytics    │  │ • Marketplace│ │                  │
│   (5004)       │  │ • Blog      │  │                  │
│                │  │ • BuildHub  │  │                  │
└────────────────┘  └─────────────┘  └──────────────────┘
```

## Core Services (pv-core)

### Platform Services (Phase 1)
- **API Gateway** - Single entry point, routing, security
- **Auth Service** - JWT, OAuth, RBAC
- **AI Service** - Multi-provider AI (Gemini, OpenAI, Claude)
- **Media Service** - File uploads, Cloudinary, image optimization

### Platform Services (Phase 2)
- **Notification Service** - Email, SMS, Push, Slack, Discord
- **Search Service** - Global search across all data
- **Analytics Service** - Event tracking, metrics

### Application Services (Phase 3-5)
- Portfolio, Career, Resume, Learning
- CRM, Finance, Marketplace, Blog
- BuildHub and future SaaS apps

## Key Features

### 🏗️ Architecture
- **Modular Monolith** - Evolves to microservices
- **Event-Driven** - Internal event bus for loose coupling
- **Domain-Driven Design** - Clean separation of concerns
- **Repository Pattern** - Data access abstraction
- **Service Layer** - Business logic isolation

### 🔒 Security
- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- Rate limiting
- Request validation (Zod)
- Helmet.js security headers
- CORS configuration
- Password hashing (bcrypt)

### 📊 Observability
- Structured logging (Winston)
- Request ID tracking
- Analytics events
- Performance monitoring
- Error tracking

### 🚀 Performance
- Connection pooling
- In-memory caching
- Response compression
- Database indexing
- Optimized queries

## Technology Stack

### Backend
- **Runtime**: Node.js 20+
- **Language**: TypeScript 5.5
- **Framework**: Express.js 4.18
- **Database**: MongoDB Atlas (Mongoose 7.7)
- **File Storage**: Cloudinary
- **AI**: Gemini, OpenAI, Claude
- **Validation**: Zod
- **Logging**: Winston

### Infrastructure
- **Package Manager**: pnpm
- **Monorepo**: pnpm workspaces
- **Containerization**: Docker
- **Deployment**: Render, Fly.io

## Project Structure

```
backend/
├── api-gateway/          # Single entry point (Port 3000)
│   ├── src/
│   │   ├── config/       # Configuration
│   │   ├── middleware/   # Express middleware
│   │   │   ├── auth.ts
│   │   │   ├── error.ts
│   │   │   ├── rateLimiter.ts
│   │   │   ├── requestLogger.ts
│   │   │   └── validation.ts
│   │   ├── utils/        # Utilities
│   │   └── index.ts      # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── auth-service/         # Authentication (Port 4000)
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── index.ts
│   └── package.json
│
├── ai-service/           # AI Operations (Port 5000)
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── prompts/
│   │   └── utils/
│   └── package.json
│
├── media-service/        # Media Management (Port 5001)
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── index.ts
│   └── package.json
│
└── [other services...]

pv-core/                  # Shared core services
├── src/
│   ├── authentication/   # Auth service logic
│   ├── authorization/    # Permission management
│   ├── ai-gateway/       # AI provider abstraction
│   ├── event-bus/        # Event-driven architecture
│   ├── notification-engine/
│   ├── search-engine/
│   ├── analytics-engine/
│   ├── file-manager/
│   ├── object-engine/
│   ├── app-registry/
│   ├── api-gateway/
│   └── types/            # TypeScript definitions
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm
- MongoDB Atlas account
- Cloudinary account

### Installation

```bash
# Install dependencies
pnpm install

# Build pv-core
pnpm --filter pv-core build

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
```

### Running Services

```bash
# Start API Gateway
pnpm --filter api-gateway dev

# Start Auth Service
pnpm --filter auth-service dev

# Start AI Service
pnpm --filter ai-service dev

# Start Media Service
pnpm --filter media-service dev
```

### Using Docker

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication
All protected endpoints require a Bearer token:
```
Authorization: Bearer <jwt-token>
```

### Standard Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "errors": [],
  "metadata": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "requestId": "uuid"
}
```

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"],
  "timestamp": "2024-01-01T00:00:00.000Z",
  "requestId": "uuid"
}
```

## Environment Variables

See [.env.example](./../.env.example) for all available configuration options.

### Required Variables
- `DATABASE_URL` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `CLIENT_URL` - Frontend URL for CORS
- `CLOUDINARY_*` - Cloudinary credentials

### Service URLs
- `AUTH_SERVICE_URL` - http://localhost:4000
- `AI_SERVICE_URL` - http://localhost:5000
- `MEDIA_SERVICE_URL` - http://localhost:5001

## Development

### Code Style
- TypeScript strict mode
- ESLint for code quality
- Prettier for formatting
- Conventional commits

### Testing
```bash
# Run all tests
pnpm test

# Run specific service tests
pnpm --filter auth-service test

# Run with coverage
pnpm test -- --coverage
```

### Building
```bash
# Build all services
pnpm build

# Build specific service
pnpm --filter api-gateway build
```

## Deployment

### Render
1. Connect your repository
2. Set environment variables
3. Deploy each service separately
4. Configure service URLs

### Fly.io
```bash
# Deploy API Gateway
flyctl deploy --config fly.api-gateway.toml

# Deploy Auth Service
flyctl deploy --config fly.auth-service.toml
```

### Docker
```bash
# Build image
docker build -t pv-platform/api-gateway ./backend/api-gateway

# Run container
docker run -p 3000:3000 pv-platform/api-gateway
```

## Monitoring

### Health Checks
- API Gateway: http://localhost:3000/health
- Auth Service: http://localhost:4000/health
- AI Service: http://localhost:5000/health
- Media Service: http://localhost:5001/health

### Logs
- Structured JSON logs in production
- Pretty printed logs in development
- Request ID tracking for debugging

### Metrics
- Request rate and response time
- Error rate by endpoint
- AI usage and costs
- Database query performance

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

## Support

For questions or issues, please contact the development team.
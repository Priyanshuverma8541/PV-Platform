# PV Platform Architecture

## Overview

PV Platform is built on a **modular, scalable architecture** inspired by enterprise platforms like Salesforce, Notion, and GitHub.

---

## Core Architecture Principles

### 1. **Decoupled Apps with Shared Infrastructure**

```
┌─────────────────────────────────────────────────────────┐
│                   PV CORE (Shared)                      │
│  Auth │ Object Manager │ API Gateway │ AI │ Search │   │
│  Notifications │ Theme │ Analytics │ Marketplace       │
└─────────────────────────────────────────────────────────┘
            ▲         ▲         ▲         ▲
            │         │         │         │
    ┌───────┴───┐  ┌──┴─────┐  ┌────┴───┐  ┌────┴─────┐
    │ Portfolio │  │ BuildHub│  │  CRM   │  │ AI Studio│
    │  (App)    │  │  (App)  │  │ (App)  │  │  (App)   │
    └───────────┘  └─────────┘  └────────┘  └──────────┘
```

### 2. **Configuration Over Hardcoding**

Everything that may change lives in:
- **Database configuration**
- **Environment variables**
- **Admin settings panel**
- **Theme configuration**
- **Integration settings**

### 3. **Universal Object Manager**

Instead of fixed schema, use a flexible object system:

```typescript
// Fixed objects (always exist)
User, Project, Client, Skill, Company, Resume, Service

// Custom objects (user-defined)
Portfolio, BlogPost, Service, Course, Certificate
```

---

## System Components

### A. PV Core Services

#### Authentication Service
- JWT tokens
- OAuth (Google, GitHub)
- Multi-factor authentication
- Session management

#### Authorization Service
- Role-based access control (RBAC)
- Custom permission rules
- Object-level permissions
- Feature flags

#### App Registry
- Dynamic app discovery
- App metadata storage
- App integration points
- Permission delegation

#### Object Manager
- Dynamic field definitions
- Relationship mapping
- Custom validation
- Automation triggers

#### API Gateway
- Request routing
- Rate limiting
- Authentication middleware
- Response transformation

#### AI Gateway
- Multiple AI provider support
- Prompt templating
- Response caching
- Usage tracking

#### Search Engine
- Full-text search
- Faceted filtering
- Real-time indexing
- Cross-app search

#### Analytics Engine
- Event tracking
- User behavior
- Business metrics
- Dashboards

#### Notification Engine
- Email
- SMS (future)
- Push notifications (future)
- Notification preferences

#### Theme Engine
- Unified design system
- Dark/light themes
- Color customization
- Component library

#### File Manager
- Cloudinary integration
- File metadata
- Access control
- CDN distribution

#### Marketplace
- Extension store
- Integration marketplace
- Version management
- Developer tools

---

### B. Independent Apps Structure

Each app has:

```
app-name/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types/
│   ├── vite.config.ts
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── types/
│   ├── server.ts
│   └── package.json
│
├── database/
│   ├── schemas/
│   ├── migrations/
│   └── seed/
│
└── docs/
    ├── README.md
    ├── API.md
    └── SETUP.md
```

---

## Data Flow

### Authentication Flow

```
1. User logs in (Google/GitHub/Email)
   ↓
2. Auth Service validates credential
   ↓
3. JWT token generated
   ↓
4. Token stored in browser/mobile
   ↓
5. Token sent with every API request
   ↓
6. API Gateway validates token
   ↓
7. Request routed to appropriate service
```

### Object Creation Flow

```
1. User creates custom object in Admin
   ↓
2. Object Manager stores definition
   ↓
3. Schema generated in respective app
   ↓
4. API endpoints auto-generated
   ↓
5. UI components auto-generated
   ↓
6. Search engine indexes object
```

### AI Integration Flow

```
1. User triggers AI action (e.g., "Generate Resume")
   ↓
2. Request sent to AI Gateway
   ↓
3. AI Gateway selects appropriate provider
   ↓
4. Prompt template filled with user data
   ↓
5. Request sent to Gemini/OpenAI/Claude
   ↓
6. Response cached and returned
   ↓
7. User can edit or save response
```

---

## Tech Stack Justification

### Frontend: React + Vite + TypeScript
- **React** - Component reusability
- **Vite** - Fast builds and HMR
- **TypeScript** - Type safety
- **Tailwind + Shadcn** - Rapid UI development
- **Framer Motion + GSAP** - Smooth animations
- **Three.js + R3F** - 3D interactions

### Backend: Node.js + Express + MongoDB
- **Node.js** - JavaScript ecosystem
- **Express** - Minimal and flexible
- **MongoDB** - Flexible schema
- **Mongoose** - Schema validation
- **Socket.io** - Real-time features
- **JWT** - Stateless authentication

### Storage
- **Cloudinary** - Image/video optimization
- **MongoDB Atlas** - Free tier available
- **Environment-based config** - Multi-environment support

### Deployment
- **Vercel** - Frontend deployment (free tier)
- **Render** - Backend deployment (free tier)
- **Docker** - Local development and production

---

## API Architecture

### Unified API Structure

```
/api/v1/
├── /auth/
│   ├── POST /login
│   ├── POST /signup
│   ├── POST /logout
│   └── POST /refresh
├── /apps/
│   ├── GET / (list all registered apps)
│   ├── GET /:appId (app details)
│   └── GET /:appId/config (app configuration)
├── /objects/
│   ├── GET / (list object types)
│   ├── GET /:objectType (get object definition)
│   ├── POST /:objectType (create object)
│   ├── GET /:objectType/:id (get object)
│   ├── PUT /:objectType/:id (update object)
│   └── DELETE /:objectType/:id (delete object)
├── /search/
│   ├── GET /?q=query (global search)
│   └── GET /:objectType?q=query (app search)
├── /analytics/
│   ├── GET /events
│   ├── GET /metrics
│   └── GET /reports
├── /notifications/
│   ├── GET / (list notifications)
│   ├── POST / (create notification)
│   └── PUT /:id/read (mark as read)
└── /ai/
    ├── POST /chat (AI chat)
    ├── POST /generate (generate content)
    └── GET /providers (list available providers)
```

### App-Specific APIs

Each app can define custom endpoints:

```
/api/v1/portfolio/
├── GET /projects
├── POST /projects
├── GET /projects/:id
└── ...

/api/v1/crm/
├── GET /clients
├── POST /clients
├── GET /clients/:id
└── ...
```

---

## Database Strategy

### Shared Collections (PV Core Database)

```
Users
├── id
├── email
├── name
├── avatar
├── settings
└── metadata

Apps
├── id
├── name
├── slug
├── icon
├── permissions
└── config

Objects (Custom definitions)
├── id
├── appId
├── name
├── fields
├── relationships
└── permissions

Integrations
├── id
├── userId
├── service (GitHub, Cloudinary, etc.)
└── credentials (encrypted)

Settings
├── id
├── key
├── value
└── scope (global/user/org)
```

### App-Specific Collections

Each app manages its own MongoDB database:

```
portfolio_db:
├── Projects
├── Skills
├── Experience
└── Resume

crm_db:
├── Clients
├── Deals
├── Tasks
└── Communications

ai_studio_db:
├── Workflows
├── Agents
├── Prompts
└── Logs
```

---

## Security Architecture

### Authentication
- JWT with expiration (7 days)
- Refresh token rotation
- HTTPS only
- Secure headers (HSTS, CSP, etc.)

### Authorization
- Role-based access control
- Object-level permissions
- API key for service-to-service
- Rate limiting per user

### Data Protection
- Environment variable encryption
- Database encryption at rest
- Cloudinary secure URLs
- CORS policy enforcement

### Audit Trail
- All changes logged
- User actions tracked
- Admin audit log
- Automated backups

---

## Scalability Strategy

### Horizontal Scaling
- **Stateless API** - No session affinity needed
- **Load balancing** - Nginx or managed service
- **Database replication** - MongoDB Atlas replication
- **Cache layer** - Redis for frequent queries

### Performance Optimization
- **CDN** - Cloudinary for media
- **Caching headers** - Browser cache
- **API response caching** - Redis
- **Lazy loading** - Components and data
- **Database indexing** - Optimize queries

### Monitoring
- **Error tracking** - Sentry or similar
- **Performance monitoring** - NewRelic or similar
- **Uptime monitoring** - UptimeRobot
- **Logs aggregation** - ELK stack or similar

---

## Development Workflow

### 1. Feature Development

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
pnpm dev

# Run tests
pnpm test

# Format code
pnpm format

# Create PR
git push origin feature/new-feature
```

### 2. App Development

```bash
# Create new app
pnpm generate:app app-name

# This creates:
# - Frontend skeleton
# - Backend skeleton  
# - Database schemas
# - API documentation

# Develop app
cd apps/app-name
pnpm dev

# Test app
pnpm test

# Build app
pnpm build
```

### 3. Core Component Development

```bash
# Create shared component
cd packages/ui

# Add component
# Test in Storybook
pnpm test

# Bump version
npm version patch

# All apps automatically use new version
```

---

## Configuration Files

### Root Configuration

```
pv-platform/
├── .env.example          # Environment template
├── .env.local            # Local environment (gitignored)
├── turbo.json            # Turborepo config
├── pnpm-workspace.yaml   # Workspace definition
├── package.json          # Root dependencies
├── tsconfig.base.json    # Base TypeScript config
├── .eslintrc.js          # ESLint config
├── .prettierrc.js        # Prettier config
└── docker-compose.yml    # Local development
```

### App Configuration

```
app-name/
├── package.json
├── tsconfig.json
├── vite.config.ts (frontend)
├── server.ts (backend)
└── .env.example
```

---

## Future Enhancements

### Phase 2
- [ ] Real-time collaboration (Socket.io)
- [ ] Advanced AI workflows (Gemini functions)
- [ ] Payment processing (Stripe)
- [ ] Mobile apps (React Native)

### Phase 3
- [ ] Machine learning models (TensorFlow.js)
- [ ] GraphQL API option
- [ ] Advanced automation (Zapier integration)
- [ ] Enterprise SSO (SAML)

### Phase 4
- [ ] Marketplace (third-party apps)
- [ ] White-label options
- [ ] Advanced analytics
- [ ] Enterprise licensing

---

## Next Steps

1. **Setup Development Environment** - See [setup/README.md](../setup/)
2. **Create First App** - Follow [app-creation/README.md](../app-creation/)
3. **Configure AI Services** - See [ai/README.md](../ai/)
4. **Setup Deployment** - See [deployment/README.md](../deployment/)

# PV Platform

**Personal Operating System** — A comprehensive, enterprise-grade platform that transforms a public portfolio into a complete personal operating system for managing careers, businesses, freelancing, AI workflows, and SaaS products.

Inspired by **Salesforce**, **Notion**, **GitHub**, **Apple**, **Vercel**, and modern SaaS architecture.

---

## 🎯 Vision

PV Platform is **NOT just a portfolio website**.

It is your **Personal Operating System (POS)** that helps you:

- 🎓 Get jobs
- 💼 Get freelance clients  
- 🏢 Manage businesses
- 🚀 Build SaaS products
- 📚 Manage learning paths
- 📊 Track career progress
- 📄 Generate resumes
- 🏗️ Build software with BuildHub
- 🎮 Control every project from one place (Mission Control)

---

## 🏗️ Platform Architecture

### Core Principle
> **If something might change in the future, it should be configurable—not hardcoded.**

### PV Core (Shared Infrastructure)
Every app inherits these services:

- **Authentication** - JWT, Google Login, GitHub Login
- **Authorization** - Role-based access control
- **App Registry** - Dynamic app discovery and integration
- **Universal Object Manager** - Custom object definitions with fields, relationships, permissions
- **API Gateway** - Unified API routing and rate limiting
- **AI Gateway** - Modular AI service integration
- **Search Engine** - Full-text search across all apps
- **Analytics Engine** - Platform-wide analytics
- **Notification Engine** - Email, SMS, push notifications
- **Theme Engine** - Unified design system and theming
- **File Manager** - Cloudinary integration for all media
- **Marketplace** - Extension and integration marketplace
- **Settings** - Global platform configuration

### Applications

Each app is **independent yet integrated**:

| App | Purpose | Independent | Shared |
|-----|---------|------------|--------|
| **Portfolio** | Public showcase | Backend, DB, API | PV Core services |
| **BuildHub** | Platform builder | Backend, DB, API | Auth, AI, Deployment |
| **CRM** | Client management | Backend, DB, API | Notifications, Search, Analytics |
| **Career** | Job tracking & goals | Backend, DB, API | AI Coach, Analytics |
| **Finance** | Business metrics | Backend, DB, API | Analytics, Notifications |
| **Learning** | Skill development | Backend, DB, API | AI Tutor, Progress tracking |
| **Resume** | Resume management | Backend, DB, API | AI Generator, Export |
| **AI Studio** | Workflow automation | Backend, DB, API | AI Core, Webhooks |
| **Admin Dashboard** | Mission Control | Frontend only | All PV Core services |

### Universal Object Philosophy

**Fixed Core Objects:**
- Users
- Projects
- Clients
- Skills
- Companies
- Resume
- Services

**Custom Objects Support:**
- Any custom object can be created with:
  - Dynamic fields
  - Custom relationships
  - Permission rules
  - AI-triggered actions
  - Attachments
  - Automation workflows
  - Activity timeline
  - Version history

---

## 💻 Tech Stack

### Frontend
```
React + Vite + TypeScript
Tailwind CSS + Shadcn UI
Framer Motion + GSAP
Three.js + React Three Fiber + Drei
```

### Backend
```
Node.js + Express.js
MongoDB + Mongoose
JWT + Socket.io
```

### Storage & Media
```
Cloudinary (primary)
MongoDB Atlas (data)
```

### Deployment
- Local Docker deployment: `docker compose up --build`
- CI build: `.github/workflows/deploy.yml`
- This repo uses `pnpm` workspaces, so CI installs via `pnpm install`
- Ensure backend services use MongoDB and environment variables from `.env.example`
- Frontend hosting: Vercel or any static site host
- Backend hosting: Render, Fly, or Docker containers

```
Vercel (frontend apps)
Render (backend services)
Docker (containerization)
```

### Local setup
- Copy `.env.example` to `.env` and fill secrets
- Start local stack: `docker compose up --build`
- Open frontend: `http://localhost:5173`
- API gateway: `http://localhost:3000`

### Authentication
```
JWT
Google OAuth
GitHub OAuth
```

---

## 🎨 UI/UX Vision

### Theme: Futuristic 2050
Inspired by:
- **Apple** - Minimalism and elegance
- **Tesla** - Futuristic interactions
- **Vercel** - Modern SaaS design
- **Glassmorphism** - Transparency and depth
- **Cyberpunk** - High-tech aesthetic
- **Iron Man JARVIS** - AI-powered assistance

### Design Elements
- 3D interactive components
- Smooth animations and transitions
- Floating objects and depth
- Interactive dashboards
- Modern typography
- Responsive across all devices
- Dark/Light theme support

---

## 🤖 AI Architecture

### Start Free (Always Scalable to Paid)

**Priorities:**
1. **Gemini API** - Core AI
2. **GitHub API** - Code insights
3. **Cloudinary API** - Image processing
4. **MongoDB Atlas** - Free tier database

**Future Integration (Plug-and-Play):**
- OpenAI (GPT-4)
- Claude (Anthropic)
- Any AI provider

### AI Features

- 💬 **AI Chat** - Ask anything about your platform
- 📝 **Resume Generator** - Auto-generate professional resumes
- 📧 **Cover Letter Generator** - Context-aware letters
- 💼 **Proposal Generator** - Auto-generate client proposals
- ✍️ **Email Generator** - Smart email writing
- 🔍 **Research Assistant** - Deep web research
- 👨‍💻 **Coding Assistant** - Code reviews and generation
- 🎓 **Career Coach** - Job market insights
- 📊 **Business Consultant** - Business metrics analysis
- 🎯 **Portfolio Assistant** - SEO and optimization

**Platform Automation:**
- Auto-tag projects with AI
- Suggest next steps
- Predict job matches
- Auto-route notifications
- Smart scheduling

---

## 📊 Mission Control Dashboard

The central hub showing:

- 📅 **Today's Priorities** - What to focus on
- 💼 **Freelance Leads** - New client opportunities
- 💻 **Job Applications** - Pipeline tracking
- 📱 **GitHub Activity** - Recent commits and PRs
- 💰 **Revenue Dashboard** - Business metrics
- ✅ **Pending Tasks** - Action items
- 📈 **Learning Progress** - Skill development
- 🤖 **AI Recommendations** - Next steps
- 📊 **Analytics** - Platform insights

---

## 🏗️ BuildHub

### What It Does
BuildHub is a **Platform Builder** that generates:

- Websites
- CRM systems
- ERP systems
- Admin dashboards
- API specifications
- Database schemas
- AI integrations
- Authentication flows
- Complete deployments

### Future Vision
Users should build entire software systems without coding.

---

## ⚙️ Configuration Philosophy

**Everything that may change should be configurable:**

- Navigation structure
- Homepage layout
- Resume format
- Skills taxonomy
- Services offered
- Project categories
- Theme colors
- API integrations
- AI settings
- Blog categories
- SEO metadata
- Deployment targets

---

## 🔗 Integrations

### Currently Supported
- GitHub
- Google OAuth
- Cloudinary
- MongoDB
- Vercel
- Render

### Future Integrations
- LinkedIn
- Salesforce
- Gmail
- Google Calendar
- Stripe
- And more...

---

## 📁 Project Structure

```
pv-platform/
├── apps/                    # Independent applications
│   ├── portfolio/           # Public portfolio
│   ├── admin/              # Mission Control dashboard
│   ├── buildhub/           # Platform builder
│   ├── ai-studio/          # AI workflow editor
│   ├── crm/                # Client management
│   ├── career/             # Job tracking
│   ├── finance/            # Business metrics
│   ├── learning/           # Skill development
│   ├── resume/             # Resume manager
│   ├── analytics/          # Analytics dashboard
│   ├── marketplace/        # Extension marketplace
│   ├── blog/               # Blog system
│   ├── home-decor/         # Example app: Home decor
│   ├── savitri-jewellers/  # Example app: E-commerce
│   ├── hospital-erp/       # Example app: Hospital ERP
│   ├── school-erp/         # Example app: School ERP
│   ├── restaurant-pos/     # Example app: Restaurant POS
│   └── future-apps/        # Placeholder for new apps
│
├── backend/                 # Backend services
│   ├── api-gateway/        # Main API entry point
│   ├── auth-service/       # Authentication
│   ├── ai-service/         # AI orchestration
│   ├── search-service/     # Search engine
│   ├── analytics-service/  # Analytics
│   ├── notification-service/
│   ├── media-service/      # Cloudinary integration
│   ├── webhook-service/    # Webhook management
│   └── [app-specific services]/
│
├── packages/               # Shared libraries
│   ├── ui/                # Shadcn UI + custom components
│   ├── hooks/             # React hooks
│   ├── utils/             # Utilities
│   ├── types/             # TypeScript types
│   ├── api-client/        # API client
│   ├── auth/              # Auth library
│   ├── ai/                # AI client
│   └── [more packages]/
│
├── pv-core/               # Core platform engine
│   ├── authentication/
│   ├── authorization/
│   ├── object-engine/
│   ├── app-registry/
│   ├── api-gateway/
│   ├── ai-gateway/
│   └── [more engines]/
│
├── database/              # DB schemas and migrations
├── cloudinary/            # Asset organization
├── ai/                    # AI prompts, agents, workflows
├── docs/                  # Documentation
├── scripts/               # Deployment and utility scripts
├── deployments/           # Docker, Kubernetes configs
├── tests/                 # Test suites
└── tools/                 # Development tools
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (package manager)
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)
- Gemini API key

### Installation

```bash
# Clone and install
pnpm install

# Copy environment template
cp .env.example .env.local

# Fill in required credentials
# See: "Required Environment Variables" below
```

### Required Environment Variables

Before running, you must provide:

**Database:**
- `DATABASE_URL` - MongoDB Atlas connection string

**Storage:**
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

**AI Services:**
- `GEMINI_API_KEY` - Google Gemini API key

**Authentication:**
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

**Deployment:**
- `VERCEL_TOKEN` - Vercel deployment token
- `RENDER_API_KEY` - Render deployment API key

### Development

```bash
# Start all apps in dev mode
pnpm dev

# Start specific app
pnpm dev --filter=portfolio

# Build everything
pnpm build

# Run tests
pnpm test

# Format code
pnpm format
```

---

## 📋 Development Rules

- ✅ **Clean Architecture** - Separate concerns
- ✅ **SOLID Principles** - Design for scalability
- ✅ **Reusable Components** - Build once, use everywhere
- ✅ **TypeScript** - Type safety
- ✅ **Decoupled Modules** - Independent development
- ✅ **Documentation** - Every module documented
- ✅ **Environment Variables** - No hardcoded secrets
- ✅ **Modularity** - AI providers can be swapped

---

## 📚 Documentation

See [docs/](docs/) directory:
- [Architecture Guide](docs/architecture/)
- [API Documentation](docs/api/)
- [Database Schema](docs/database/)
- [Setup Guide](docs/setup/)
- [Deployment Guide](docs/deployment/)
- [AI Integration Guide](docs/ai/)
- [BuildHub Guide](docs/modules/)

---

## ⚠️ Before Implementation

**Stop and ask for:**

- ✋ MongoDB Atlas connection string
- ✋ Cloudinary Cloud Name, API Key, Secret
- ✋ Gemini API Key
- ✋ GitHub OAuth credentials
- ✋ Google OAuth credentials
- ✋ Domain name
- ✋ Logo and branding assets
- ✋ Social media URLs
- ✋ Existing project repositories
- ✋ Resume/portfolio data
- ✋ Any other external service credentials

**Never assume or invent credentials.**

---

## 🎯 End Goal

Build a scalable personal operating system that:
- ✅ Starts as a portfolio
- ✅ Grows into a complete ecosystem
- ✅ Manages career, freelancing, businesses, AI
- ✅ Integrates new projects seamlessly
- ✅ Reuses architecture instead of rebuilding
- ✅ Scales from personal to enterprise

---

## 📄 License

All rights reserved. © 2024

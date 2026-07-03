# PV Platform - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- pnpm package manager
- MongoDB Atlas account (already configured in .env)

### Step 1: Install Dependencies

```bash
# Install all dependencies across the monorepo
pnpm install
```

This will install:
- Frontend dependencies (React, Three.js, Framer Motion, etc.)
- Backend dependencies (Express, Mongoose, JWT, etc.)
- Package dependencies (axios for api-client, etc.)

### Step 2: Configure Environment Variables

The `.env` file is already configured with:
- MongoDB Atlas connection
- JWT secrets
- Service ports

Verify the `.env` file exists and has the correct values.

### Step 3: Start Backend Services

Open **3 separate terminal windows**:

```bash
# Terminal 1 - Auth Service
cd backend/auth-service
pnpm dev
# Should start on port 4000

# Terminal 2 - Project Service (BuildHub)
cd backend/project-service
pnpm dev
# Should start on port 5013

# Terminal 3 - Frontend
cd apps/admin
pnpm dev
# Should start on port 5173 (or similar)
```

### Step 4: Access the Application

1. Open browser to `http://localhost:5173`
2. Click "Get Started" or "Launch Mission Control"
3. Register a new account
4. Explore BuildHub - sample projects will be auto-created

## 📦 What's Been Built

### Backend Services
- ✅ **Auth Service** (port 4000)
  - POST /api/auth/register
  - POST /api/auth/login
  - GET /api/auth/me
  - POST /api/auth/forgot-password
  - POST /api/auth/reset-password
  - GET /api/auth/verify-email/:token

- ✅ **Project Service** (port 5013)
  - GET /api/projects
  - GET /api/projects/:id
  - POST /api/projects
  - PUT /api/projects/:id
  - DELETE /api/projects/:id

### Frontend Applications
- ✅ **Landing Page** - 3D hero with Three.js
- ✅ **Mission Control** - Main dashboard
- ✅ **BuildHub** - Project management (connected to backend)
- ✅ **Career** - Job applications tracker
- ✅ **Learning** - Courses and skills
- ✅ **CRM** - Contact management
- ✅ **Finance** - Financial tracking
- ✅ **AI Studio** - AI chat and tools

### Packages
- ✅ **@pv/api-client** - Axios client with JWT interceptors
- ✅ **@pv/auth** - React auth context and protected routes
- ✅ **@pv/ui** - Reusable UI components (GlassCard, Widget, etc.)

## 🔧 Troubleshooting

### Issue: "Cannot find module 'axios'"
**Solution**: Run `pnpm install` in the root directory

### Issue: "Cannot find module '@pv/api-client'"
**Solution**: 
1. Ensure `packages/api-client/package.json` exists
2. Run `pnpm install` from root
3. Restart your dev server

### Issue: Port already in use
**Solution**: Change the port in the `.env` file:
```
AUTH_SERVICE_PORT=4001
BUILDHUB_SERVICE_PORT=5014
```

### Issue: MongoDB connection error
**Solution**: Verify MongoDB Atlas connection string in `.env`:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pv-platform
```

## 🎯 Testing the Platform

### Test Authentication
1. Go to `http://localhost:5173`
2. Click "Launch Mission Control"
3. Click "Sign In" or "Get Started"
4. Register a new account
5. You should be logged in and see Mission Control

### Test BuildHub
1. Navigate to BuildHub from Mission Control
2. You should see 4 sample projects automatically created:
   - Savitri Livings (https://home-decor-inky.vercel.app/)
   - IntegroHub (https://integro-hub.vercel.app/)
   - CardioSense (ML project)
   - PV Platform (this platform)
3. Projects are stored in MongoDB Atlas
4. Each user gets their own set of projects

### Test Data Isolation
1. Register a second user
2. Create/delete projects
3. Logout and login with first user
4. Each user sees only their own projects

## 📊 Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (apps/admin)           │
│  - React + TypeScript                   │
│  - Three.js + Framer Motion             │
│  - Glassmorphism UI                     │
└─────────────────────────────────────────┘
                    │
                    │ HTTP/REST API
                    │
┌─────────────────────────────────────────┐
│      API Gateway (optional)             │
│  - Rate limiting                        │
│  - Authentication                       │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐   ┌─────────▼──────┐
│ Auth Service   │   │ Project Service│
│  - Port 4000   │   │  - Port 5013   │
│  - JWT         │   │  - CRUD        │
│  - Users       │   │  - Projects    │
└────────────────┘   └────────────────┘
        │                       │
        └───────────┬───────────┘
                    │
          ┌─────────▼─────────┐
          │  MongoDB Atlas    │
          │  - Users          │
          │  - Projects       │
          │  - Deployments    │
          └───────────────────┘
```

## 🚢 Deployment

### Deploy Backend to Railway

1. Create Railway account
2. Deploy each service:
   - `backend/auth-service`
   - `backend/project-service`
3. Set environment variables in Railway dashboard
4. Update frontend API_URL to point to Railway URLs

### Deploy Frontend to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `apps/admin`
4. Add environment variables:
   - `VITE_API_URL=https://your-backend.railway.app/api`
5. Deploy

## 📝 Next Steps

### To Add More Features:

1. **Create Career Service** (backend/career-service)
   - Models: Application, Interview, Resume
   - Controllers: CRUD operations
   - Connect to Career.tsx frontend

2. **Create Learning Service** (backend/learning-service)
   - Models: Course, Skill, Certificate
   - Controllers: CRUD operations
   - Connect to Learning.tsx frontend

3. **Create CRM Service** (backend/crm-service)
   - Models: Contact, Deal, Interaction
   - Controllers: CRUD operations
   - Connect to CRM.tsx frontend

4. **Create Finance Service** (backend/finance-service)
   - Models: Transaction, Invoice, Budget
   - Controllers: CRUD operations
   - Connect to Finance.tsx frontend

## 🎨 Design System

- **Colors**: Cyan (#06b6d4) to Purple (#a855f7) gradients
- **Typography**: Inter font family
- **Effects**: Glassmorphism, backdrop blur
- **Animations**: Framer Motion for smooth transitions
- **3D**: Three.js for hero section

## 📚 Documentation

- `IMPLEMENTATION_PROGRESS.md` - Detailed progress tracking
- `docs/architecture/` - Architecture documentation
- `docs/roadmap/` - Product roadmap
- `docs/setup/` - Setup guides

## 🆘 Support

If you encounter issues:
1. Check the console for error messages
2. Verify all services are running
3. Check MongoDB Atlas connection
4. Ensure environment variables are set correctly

## ✨ What Makes This Enterprise-Grade

1. **Microservices Architecture** - Separate services for auth, projects, etc.
2. **JWT Authentication** - Secure, stateless authentication
3. **MongoDB Atlas** - Scalable cloud database
4. **TypeScript** - Type safety across the stack
5. **Monorepo** - Shared packages and consistent tooling
6. **Data Isolation** - Each user sees only their data
7. **Error Handling** - Comprehensive error handling
8. **Loading States** - Professional UX with loading indicators
9. **Responsive Design** - Works on all screen sizes
10. **Production Ready** - Can be deployed to production

---

**The PV Platform is now a real, functional multi-user SaaS application!** 🎉
# Getting Started with PV Platform

Welcome to **PV Platform** - Your Personal Operating System for managing careers, businesses, freelancing, and AI workflows.

This guide will help you get started quickly.

---

## 🎯 What is PV Platform?

PV Platform is **not just a portfolio website**.

It's a complete ecosystem where you can:
- 📍 Showcase your work publicly
- 💼 Manage clients and projects
- 🎓 Track your career
- 📈 Generate AI-powered content
- 🚀 Build your own apps
- 📊 Get business insights
- 🤖 Automate everything

---

## 📋 Before You Start

You'll need these credentials (⚠️ don't skip this):

| Required | Service | Get It |
|----------|---------|--------|
| ✅ | MongoDB Atlas | [mongodb.com/cloud](https://mongodb.com/cloud) - Free tier |
| ✅ | Cloudinary | [cloudinary.com](https://cloudinary.com) - Free tier |
| ✅ | Gemini API | [aistudio.google.com](https://aistudio.google.com) - Free |
| ✅ | GitHub OAuth | [github.com/settings/developers](https://github.com/settings/developers) |
| ✅ | Google OAuth | [console.cloud.google.com](https://console.cloud.google.com) |

See [Information Checklist](./docs/setup/INFORMATION_CHECKLIST.md) for complete requirements.

---

## 🚀 Quick Setup (15 minutes)

### Step 1: Install Dependencies

```bash
# Install Node.js 18+ if needed
# Then install pnpm
npm install -g pnpm

# Navigate to project
cd "c:\Users\priya\Desktop\The PV Platform"

# Install all dependencies
pnpm install
```

### Step 2: Configure Environment

```bash
# Copy template
copy .env.example .env.local

# Edit .env.local with your credentials
# Instructions: See docs/setup/QUICK_START.md
```

**Key variables to set:**
```env
DATABASE_URL=your_mongodb_url
CLOUDINARY_CLOUD_NAME=your_cloud_name
GEMINI_API_KEY=your_gemini_key
GITHUB_CLIENT_ID=your_github_id
GOOGLE_CLIENT_ID=your_google_id
```

### Step 3: Start Development

```bash
# Start all apps
pnpm dev

# Open browser
# http://localhost:3000
```

### Step 4: Verify Setup

```bash
# Test API
curl http://localhost:3000/api/v1/apps

# You should see a list of available apps
```

✅ **Setup complete!**

---

## 📚 Essential Documentation

Read these in order:

1. **[README.md](./README.md)** (5 min)
   - Platform overview
   - Core features

2. **[Architecture Guide](./docs/architecture/ARCHITECTURE.md)** (15 min)
   - How everything fits together
   - System components
   - Data flow

3. **[Configuration Philosophy](./docs/architecture/CONFIGURATION.md)** (10 min)
   - How to make things configurable
   - Best practices

4. **[Quick Setup Guide](./docs/setup/QUICK_START.md)** (10 min)
   - Detailed setup steps
   - Troubleshooting

5. **[AI Integration Guide](./docs/ai/AI_INTEGRATION.md)** (15 min)
   - How to use AI features
   - Adding new AI providers

6. **[Development Guidelines](./docs/architecture/DEVELOPMENT_GUIDELINES.md)** (20 min)
   - Code standards
   - Best practices

---

## 🏗️ Platform Structure

```
PV Platform
├── Portfolio (Public)       → Your showcase
├── Admin Dashboard          → Mission Control
├── CRM                      → Client management
├── Career                   → Job tracking
├── Finance                  → Business metrics
├── Resume                   → Resume builder
├── AI Studio                → AI workflows
├── Learning                 → Skill development
├── BuildHub                 → App builder
└── Future Apps              → Your ideas
```

Each app:
- Has its own frontend, backend, database
- Shares PV Core services (auth, AI, search, etc.)
- Can be deployed independently
- Can be used alone or together

---

## 🔧 Common Tasks

### Start a Specific App

```bash
pnpm dev --filter=portfolio
```

### Build Everything

```bash
pnpm build
```

### Run Tests

```bash
pnpm test
```

### Format Code

```bash
pnpm format
```

### Check for Errors

```bash
pnpm lint
```

---

## 🎨 Customization

### Change Colors/Theme

See [Configuration Philosophy](./docs/architecture/CONFIGURATION.md) - all theme settings are configurable through the admin dashboard.

### Add Your Resume Data

1. Fill out [Information Checklist](./docs/setup/INFORMATION_CHECKLIST.md)
2. Add your data to the resume app
3. Generate AI-powered versions

### Setup AI Features

1. Get Gemini API key from [aistudio.google.com](https://aistudio.google.com)
2. Add to `.env.local`
3. AI features automatically available

### Add Custom Apps

Follow [App Development Guide](./docs/architecture/APP_CREATION.md) to create your own apps.

---

## 🤖 AI Features

All AI features start with free **Gemini API**.

Available:
- 💬 AI Chat
- 📝 Resume Generator
- 📧 Cover Letter Generator
- 💼 Proposal Generator
- 🎓 Career Coach
- 👨‍💻 Code Assistant

Can easily switch to OpenAI, Claude, or other providers without code changes.

See [AI Integration Guide](./docs/ai/AI_INTEGRATION.md).

---

## 📱 Apps Overview

### Portfolio
Public showcase of your work. Featured projects, skills, contact info.

```bash
cd apps/portfolio
pnpm dev
```

### Admin Dashboard
Central control panel (Mission Control). See all apps, manage settings, configure integrations.

```bash
cd apps/admin
pnpm dev
```

### CRM
Manage clients, deals, tasks, communications.

```bash
cd apps/crm
pnpm dev
```

### Career
Track jobs, applications, goals.

```bash
cd apps/career
pnpm dev
```

### Resume
Build and manage resumes with AI help.

```bash
cd apps/resume
pnpm dev
```

### AI Studio
Create AI workflows, automation.

```bash
cd apps/ai-studio
pnpm dev
```

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Connect GitHub repo
# Vercel auto-deploys on push
# Takes ~2 minutes
```

### Backend (Render)
```bash
# Create web service
# Connect GitHub repo
# Deploy from main branch
# Takes ~5 minutes
```

See [Deployment Guide](./docs/deployment/) for detailed instructions.

---

## 🐛 Troubleshooting

**Problem: "Cannot connect to database"**
```bash
# Check .env.local has DATABASE_URL
# Verify connection string from MongoDB Atlas
# Ensure IP whitelist includes 0.0.0.0/0
```

**Problem: "API returns 401 Unauthorized"**
```bash
# Set JWT_SECRET in .env.local
# Ensure auth service is running
```

**Problem: "Cloudinary upload fails"**
```bash
# Verify CLOUDINARY_API_KEY and SECRET
# Test credentials at cloudinary.com/console
```

**Problem: "Port 3000 already in use"**
```bash
# Kill process using port 3000
# Or use different port: PORT=3001 pnpm dev
```

See [Quick Start Guide](./docs/setup/QUICK_START.md#troubleshooting) for more solutions.

---

## 📊 Roadmap

### Phase 1 (Month 1-2): Foundation ✅
- Core services
- Authentication
- API Gateway
- Component library

### Phase 2 (Month 3-4): Portfolio & Public
- Public portfolio site
- SEO optimization
- Analytics

### Phase 3 (Month 5-6): Ecosystem
- CRM app
- Career tracker
- Resume builder

### Phase 4 (Month 7-8): AI & Automation
- AI generators
- Automation workflows
- Smart recommendations

### Phase 5 (Month 9+): Enterprise
- Marketplace
- Advanced BuildHub
- Team collaboration

See full [Roadmap](./docs/roadmap/ROADMAP.md).

---

## 🤝 Need Help?

### Documentation
- [FAQ](./docs/FAQ.md) - Common questions
- [Troubleshooting](./docs/setup/QUICK_START.md#troubleshooting)
- [API Documentation](./docs/api/)

### Development
- [Development Guidelines](./docs/architecture/DEVELOPMENT_GUIDELINES.md)
- [PV Core Spec](./docs/architecture/PV_CORE.md)
- [Configuration Guide](./docs/architecture/CONFIGURATION.md)

### Issues?
1. Check relevant documentation
2. Review error message carefully
3. Check `.env.local` configuration
4. Test API endpoints with curl
5. Check logs for detailed errors

---

## ✅ Next Steps

Choose what to do next:

### If you want to...

**See it working quickly**
→ Run `pnpm dev` and visit http://localhost:3000

**Add your personal info**
→ Complete [Information Checklist](./docs/setup/INFORMATION_CHECKLIST.md)

**Deploy to internet**
→ See [Deployment Guide](./docs/deployment/)

**Customize the UI**
→ See [Configuration Guide](./docs/architecture/CONFIGURATION.md)

**Use AI features**
→ See [AI Integration Guide](./docs/ai/AI_INTEGRATION.md)

**Build a new app**
→ See App Development Guide (coming soon)

**Understand architecture**
→ Read [Architecture Guide](./docs/architecture/ARCHITECTURE.md)

---

## 📞 Important Contacts

Save these:

- **MongoDB Support**: support.mongodb.com
- **Cloudinary Help**: cloudinary.com/contact
- **Gemini API Issues**: support.google.com
- **Your Repo Issues**: GitHub Issues

---

## 🎓 Learning Resources

- **TypeScript**: https://www.typescriptlang.org/docs
- **React**: https://react.dev
- **Node.js**: https://nodejs.org/docs
- **MongoDB**: https://docs.mongodb.com
- **Express**: https://expressjs.com

---

## 📝 Remember

✅ **No hardcoding** - Everything in config or env  
✅ **Always ask** - Never assume credentials  
✅ **Document changes** - Keep docs updated  
✅ **Test thoroughly** - Before deploying  
✅ **Ask for help** - Better than guessing  

---

## 🎉 You're Ready!

You now have:
- ✅ Complete platform structure
- ✅ All documentation
- ✅ Development environment ready
- ✅ Deployment ready
- ✅ AI integration ready

**Start with:** `pnpm dev`

**Questions?** Check the docs or create an issue.

**Happy building!** 🚀

---

**Last Updated:** 2024-06-28  
**Version:** 1.0.0  
**Status:** Ready for Development

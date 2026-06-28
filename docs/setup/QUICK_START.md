# Quick Setup Guide

## Prerequisites

Before starting, gather these credentials and information:

### Required Information

**Collected?** | **Item** | **Where to Get**
---|---|---
☐ | MongoDB Atlas connection string | [mongodb.com/cloud](https://mongodb.com/cloud)
☐ | Cloudinary Cloud Name | [cloudinary.com](https://cloudinary.com)
☐ | Cloudinary API Key | [cloudinary.com/console](https://cloudinary.com/console)
☐ | Cloudinary API Secret | [cloudinary.com/console](https://cloudinary.com/console)
☐ | Gemini API Key | [aistudio.google.com](https://aistudio.google.com)
☐ | GitHub OAuth Client ID | [github.com/settings/developers](https://github.com/settings/developers)
☐ | GitHub OAuth Client Secret | [github.com/settings/developers](https://github.com/settings/developers)
☐ | Google OAuth Client ID | [console.cloud.google.com](https://console.cloud.google.com)
☐ | Google OAuth Client Secret | [console.cloud.google.com](https://console.cloud.google.com)
☐ | Domain name | e.g., example.com
☐ | Personal GitHub repository URL | e.g., github.com/yourname/portfolio
☐ | LinkedIn profile URL | e.g., linkedin.com/in/yourname (optional)
☐ | Social media URLs | Twitter, LinkedIn, etc. (optional)

---

## Step-by-Step Setup

### 1. MongoDB Atlas Setup (Free Tier)

```bash
# Go to mongodb.com/cloud and create account

# Create a free cluster:
# - Choose region closest to you
# - Wait for cluster to be ready (5-10 minutes)

# Create database user:
# - Username: pv_user
# - Auto-generate password
# - Copy password (you'll need it)

# Get connection string:
# - Click "Connect"
# - Choose "Drivers"
# - Copy connection string
# - Replace <password> with your password
# - Replace myFirstDatabase with your DB name

# Format:
# mongodb+srv://pv_user:PASSWORD@cluster.mongodb.net/pv_ecosystem?retryWrites=true&w=majority
```

### 2. Cloudinary Setup (Free Tier)

```bash
# Go to cloudinary.com and sign up

# Get credentials:
# - Cloud Name: Dashboard top left
# - API Key: Account > API Keys
# - API Secret: Account > API Keys

# Create folders for organization:
# - portfolio/
# - blogs/
# - projects/
# - uploads/
# - etc.
```

### 3. Gemini API Setup (Free)

```bash
# Go to aistudio.google.com

# Create API Key:
# - Click "Get API Key"
# - Create in new project
# - Copy the key

# Test in console to ensure it works
```

### 4. GitHub OAuth Setup

```bash
# Go to github.com/settings/developers

# Create "OAuth App":
# - Application name: PV Platform
# - Homepage URL: https://yourdomain.com (or http://localhost:3000)
# - Authorization callback URL: https://yourdomain.com/auth/callback
# - Copy Client ID and Client Secret
```

### 5. Google OAuth Setup

```bash
# Go to console.cloud.google.com

# Create new project:
# - Project name: PV Platform

# Create OAuth consent screen:
# - External (personal use)
# - Add email and app name

# Create OAuth credentials:
# - Application type: Web application
# - Authorized redirect URLs: https://yourdomain.com/auth/google/callback
# - Copy Client ID and Secret
```

### 6. Environment Setup

```bash
# Navigate to project
cd "c:\Users\priya\Desktop\The PV Platform"

# Copy environment template
copy .env.example .env.local

# Edit .env.local with your credentials
```

**Fill in .env.local:**

```env
# Database
DATABASE_URL=mongodb+srv://pv_user:PASSWORD@cluster.mongodb.net/pv_ecosystem?retryWrites=true&w=majority

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Services
GEMINI_API_KEY=your_gemini_api_key

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Deployment (optional for now)
VERCEL_TOKEN=your_vercel_token
RENDER_API_KEY=your_render_api_key

# Domain (use localhost for development)
DOMAIN=http://localhost:3000
NODE_ENV=development
```

### 7. Install Dependencies

```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Install dependencies
pnpm install

# This will install all packages in the monorepo
```

### 8. Start Development

```bash
# Start Docker services (optional, for local MongoDB)
docker-compose up -d

# Or use MongoDB Atlas (recommended for now)

# Start development server
pnpm dev

# This will start all apps in development mode
```

### 9. Verify Setup

```bash
# Test authentication
curl http://localhost:3000/api/v1/auth/me

# Test AI Gateway
curl -X POST http://localhost:3000/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'

# Test app registry
curl http://localhost:3000/api/v1/apps
```

---

## Troubleshooting

### MongoDB Connection Failed

```bash
# Check connection string format
# mongodb+srv://username:password@host/database

# Ensure:
# - Password is URL encoded (use special character encoding)
# - IP whitelist includes 0.0.0.0/0 (for development)
# - Database user exists

# Test connection:
mongodb mongodb+srv://pv_user:PASSWORD@cluster.mongodb.net/pv_ecosystem
```

### Cloudinary API Error

```bash
# Verify credentials
curl https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload \
  -F "file=@test.jpg" \
  -F "api_key=YOUR_API_KEY" \
  -F "api_secret=YOUR_API_SECRET"

# Check API credentials in account settings
```

### Gemini API Not Working

```bash
# Verify API key
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts":[{"text": "Hello"}]
    }]
  }'
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

---

## Next Steps

After setup is complete:

1. **Explore the apps** - Visit `http://localhost:3000`
2. **Read documentation** - See [docs/](../docs/)
3. **Create first app** - Follow [app-creation guide](./APP_CREATION.md)
4. **Configure AI** - Set up AI features as needed
5. **Deploy** - Deploy to Vercel/Render when ready

---

## Getting Help

If you encounter issues:

1. **Check logs** - `pnpm dev` shows detailed errors
2. **Verify credentials** - Re-check all API keys and secrets
3. **Test endpoints** - Use curl or Postman to test APIs
4. **Read error messages** - They often contain solutions
5. **Check documentation** - See relevant docs for each service

---

## Common Errors

### "Cannot find module '@pv/ui'"

```bash
# Rebuild packages
pnpm build
pnpm dev
```

### "CORS error"

```env
# Add to .env.local
CORS_ORIGIN=http://localhost:3000
```

### "JWT token invalid"

```bash
# Ensure JWT_SECRET is set
JWT_SECRET=your_secret_key_here
```

### "Cloudinary upload failed"

```bash
# Check folder structure exists in Cloudinary
# Create folders through Cloudinary dashboard if needed
```

---

## What's Next?

✅ Development environment is ready  
✅ All services are connected  
✅ You can start building!

See [Building Your First App](./APP_CREATION.md) to get started.

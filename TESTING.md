# PV Platform - Testing Guide

## Prerequisites

1. **Install Dependencies**
```bash
pnpm install
```

2. **Set Up Environment Variables**
Create a `.env` file in the root directory:
```env
# Database (REQUIRED)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pv-platform

# JWT (REQUIRED - min 32 characters)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long-1234567890

# Server
NODE_ENV=development
PORT=3000

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:5174

# Service URLs
AUTH_SERVICE_URL=http://localhost:4000
PROJECT_SERVICE_URL=http://localhost:4001
AI_SERVICE_URL=http://localhost:4002
MEDIA_SERVICE_URL=http://localhost:4003

# Optional APIs
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Testing the Complete System

### Step 1: Start All Services

Open 5 separate terminal windows and run:

**Terminal 1 - API Gateway:**
```bash
pnpm dev --filter=api-gateway
```

**Terminal 2 - Auth Service:**
```bash
pnpm dev --filter=auth-service
```

**Terminal 3 - Project Service:**
```bash
pnpm dev --filter=project-service
```

**Terminal 4 - AI Service:**
```bash
pnpm dev --filter=ai-service
```

**Terminal 5 - Media Service:**
```bash
pnpm dev --filter=media-service
```

### Step 2: Test API Gateway

```bash
# Health check
curl http://localhost:3000/health

# Expected response:
# {
#   "success": true,
#   "service": "api-gateway",
#   "status": "healthy",
#   "timestamp": "2024-01-01T00:00:00.000Z"
# }
```

### Step 3: Test Auth Service

#### 3.1 Register a New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "test@example.com",
      "profile": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "emailVerified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save the token for later requests!**

#### 3.2 Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

#### 3.3 Get Current User
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Step 4: Test Project Service

#### 4.1 Create a Project
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Awesome Project",
    "description": "A full-stack web application",
    "category": "category-id-here",
    "techStack": ["React", "Node.js", "MongoDB"],
    "status": "active",
    "featured": true
  }'
```

#### 4.2 Get All Projects
```bash
curl "http://localhost:3000/api/projects?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 4.3 Get Single Project
```bash
curl http://localhost:3000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 4.4 Update Project
```bash
curl -X PUT http://localhost:3000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Project Name",
    "status": "completed"
  }'
```

#### 4.5 Delete Project
```bash
curl -X DELETE http://localhost:3000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Step 5: Test AI Service

#### 5.1 Chat with AI
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Help me write a professional bio",
    "context": {
      "role": "developer",
      "experience": "5 years"
    }
  }'
```

#### 5.2 Generate Resume
```bash
curl -X POST http://localhost:3000/api/ai/resume/generate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "template": "modern",
    "data": {
      "name": "John Doe",
      "email": "john@example.com",
      "skills": ["JavaScript", "React", "Node.js"]
    }
  }'
```

#### 5.3 Generate Proposal
```bash
curl -X POST http://localhost:3000/api/ai/proposal/generate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "client-id-here",
    "projectDetails": "E-commerce website development",
    "tone": "professional"
  }'
```

### Step 6: Test Media Service

#### 6.1 Upload Media (Placeholder)
```bash
curl -X POST http://localhost:3000/api/media/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@/path/to/image.jpg"
```

#### 6.2 Get All Media
```bash
curl "http://localhost:3000/api/media?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Automated Testing Script

Create a file `test-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"
EMAIL="test@example.com"
PASSWORD="SecurePass123!"
FIRST_NAME="John"
LAST_NAME="Doe"

echo "=== Testing PV Platform API ==="
echo ""

# Test Health Check
echo "1. Testing API Gateway Health..."
curl -s $BASE_URL/health | jq .
echo ""

# Register User
echo "2. Registering new user..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"firstName\":\"$FIRST_NAME\",\"lastName\":\"$LAST_NAME\"}")
echo $REGISTER_RESPONSE | jq .
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.data.token')
echo ""

# Login
echo "3. Testing login..."
curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" | jq .
echo ""

# Get Current User
echo "4. Getting current user..."
curl -s $BASE_URL/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# Create Project
echo "5. Creating project..."
PROJECT_RESPONSE=$(curl -s -X POST $BASE_URL/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project","description":"Testing","techStack":["React"],"status":"active"}')
echo $PROJECT_RESPONSE | jq .
PROJECT_ID=$(echo $PROJECT_RESPONSE | jq -r '.data._id')
echo ""

# Get Projects
echo "6. Getting all projects..."
curl -s "$BASE_URL/api/projects?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# AI Chat
echo "7. Testing AI chat..."
curl -s -X POST $BASE_URL/api/ai/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello AI"}' | jq .
echo ""

echo "=== Testing Complete ==="
```

Run the test:
```bash
chmod +x test-api.sh
./test-api.sh
```

## Database Testing

### Connect to MongoDB
```bash
# Using MongoDB Compass or mongosh
mongosh "mongodb+srv://username:password@cluster.mongodb.net/pv-platform"
```

### Verify Data
```javascript
// In mongosh
use pv-platform

// Check users
db.users.find().pretty()

// Check projects
db.projects.find().pretty()

// Count documents
db.users.countDocuments()
db.projects.countDocuments()
```

## Common Issues and Solutions

### Issue 1: "Cannot find module '@pv/*'"
**Solution:** Run `pnpm install` to install and link workspace dependencies

### Issue 2: "MongoDB connection failed"
**Solution:** 
- Check your MONGODB_URI in .env
- Ensure MongoDB Atlas is accessible
- Check network/firewall settings

### Issue 3: "Port already in use"
**Solution:**
```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 PID  # macOS/Linux
taskkill /PID PID /F  # Windows
```

### Issue 4: "JWT secret too short"
**Solution:** Ensure JWT_SECRET is at least 32 characters long

## Performance Testing

### Using Apache Bench
```bash
# Test auth endpoint
ab -n 1000 -c 10 -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/auth/me
```

### Using k6
```bash
# Install k6
# Create test.js
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const res = http.get('http://localhost:3000/health');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
}

# Run test
k6 run test.js
```

## Load Testing Results

Expected performance metrics:
- **Health Check:** < 50ms response time
- **Auth endpoints:** < 200ms response time
- **Project CRUD:** < 300ms response time
- **AI endpoints:** < 1000ms response time (depends on AI provider)

## Security Testing

### Test Authentication
```bash
# Try accessing protected route without token (should fail)
curl http://localhost:3000/api/auth/me

# Try with invalid token (should fail)
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer invalid-token"
```

### Test Input Validation
```bash
# Try registering with invalid email
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","password":"short"}'
```

## Monitoring

### Check Logs
All services log to console with timestamps:
```
[INFO] POST /api/auth/register
[INFO] User registered: test@example.com
[ERROR] Login error: ...
```

### Health Checks
```bash
# Check all services
curl http://localhost:3000/health  # API Gateway
curl http://localhost:4000/health  # Auth Service
curl http://localhost:4001/health  # Project Service
curl http://localhost:4002/health  # AI Service
curl http://localhost:4003/health  # Media Service
```

## Next Steps

1. **Add Unit Tests** - Test individual functions
2. **Add Integration Tests** - Test API endpoints
3. **Add E2E Tests** - Test complete user flows
4. **Set up CI/CD** - Automated testing on push
5. **Add Monitoring** - APM tools like New Relic, DataDog
6. **Add Logging** - Centralized logging with ELK stack

## Success Criteria

✅ All services start without errors
✅ Health checks return 200 OK
✅ User registration works
✅ User login works and returns JWT
✅ Protected routes require authentication
✅ Projects can be CRUD operations
✅ AI endpoints respond (even if placeholder)
✅ All data is stored in MongoDB
✅ No hardcoded values in code
✅ Environment variables are validated
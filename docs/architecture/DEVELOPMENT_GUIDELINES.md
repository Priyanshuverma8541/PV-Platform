# Development Guidelines

Follow these guidelines to maintain code quality, consistency, and architectural integrity across PV Platform.

---

## Core Principles

### 1. **Configuration Over Hardcoding**
```typescript
// ❌ BAD
const FEATURE_ENABLED = true;
const API_URL = "https://api.example.com";

// ✅ GOOD
const FEATURE_ENABLED = process.env.FEATURE_ENABLED === 'true' || 
                        await getSettings('feature.enabled');
const API_URL = process.env.API_URL || 
                await getSettings('api.url');
```

### 2. **Modular Architecture**
```typescript
// ❌ BAD - Tight coupling
import authService from './auth';
import aiService from './ai';
authService.setupAI(aiService);

// ✅ GOOD - Loose coupling
interface Service {
  init(): Promise<void>;
  execute(action: string, params: any): Promise<any>;
}

class GatewayService {
  constructor(private services: Map<string, Service>) {}
  
  async route(service: string, action: string, params: any) {
    return this.services.get(service)?.execute(action, params);
  }
}
```

### 3. **Type Safety**
```typescript
// ❌ BAD
function createUser(data: any): any {
  return { ...data, id: Math.random() };
}

// ✅ GOOD
interface CreateUserInput {
  email: string;
  name: string;
  password: string;
}

interface User extends CreateUserInput {
  id: string;
  createdAt: Date;
}

async function createUser(data: CreateUserInput): Promise<User> {
  validateEmail(data.email);
  validatePassword(data.password);
  return db.users.create(data);
}
```

### 4. **Error Handling**
```typescript
// ❌ BAD
async function fetchData() {
  return fetch('/api/data').then(r => r.json());
}

// ✅ GOOD
class APIError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchData() {
  try {
    const res = await fetch('/api/data');
    
    if (!res.ok) {
      throw new APIError(
        `Failed to fetch data: ${res.statusText}`,
        'FETCH_ERROR',
        res.status
      );
    }

    return await res.json();
  } catch (error) {
    if (error instanceof APIError) {
      logger.error('API Error', { code: error.code, status: error.status });
      throw error;
    }

    logger.error('Unexpected error', error);
    throw new APIError('Unexpected error', 'UNKNOWN_ERROR', 500);
  }
}
```

### 5. **Logging**
```typescript
// ❌ BAD
console.log('User created');
console.log(user);

// ✅ GOOD
logger.info('User created', {
  userId: user.id,
  email: user.email,
  timestamp: new Date().toISOString()
});

logger.debug('User object', { user }, { redact: ['password'] });
```

---

## File Structure

### Backend Service Structure

```
service-name/
├── src/
│   ├── index.ts              # Service entry point
│   ├── server.ts             # Express app setup
│   ├── routes/               # API routes
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   └── users.ts
│   ├── controllers/          # Request handlers
│   │   ├── index.ts
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── services/             # Business logic
│   │   ├── index.ts
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   ├── models/               # Data models
│   │   ├── index.ts
│   │   ├── user.model.ts
│   │   └── session.model.ts
│   ├── middleware/           # Express middleware
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── error.ts
│   │   └── logger.ts
│   ├── utils/                # Utilities
│   │   ├── index.ts
│   │   ├── crypto.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   ├── types/                # TypeScript types
│   │   ├── index.ts
│   │   ├── express.ts
│   │   └── domain.ts
│   └── config/               # Configuration
│       ├── index.ts
│       ├── database.ts
│       └── cache.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── .env.example
├── .eslintrc.js
├── .prettierrc.js
├── tsconfig.json
├── package.json
└── README.md
```

### Frontend App Structure

```
app-name/
├── src/
│   ├── index.tsx             # App entry point
│   ├── main.tsx              # React rendering
│   ├── pages/                # Route pages
│   │   ├── home.tsx
│   │   ├── dashboard.tsx
│   │   └── settings.tsx
│   ├── components/           # React components
│   │   ├── common/           # Shared components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── features/         # Feature-specific
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   └── Settings/
│   │   └── forms/            # Form components
│   │       ├── LoginForm.tsx
│   │       └── SignupForm.tsx
│   ├── hooks/                # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useSettings.ts
│   │   └── useNavigation.ts
│   ├── services/             # API clients
│   │   ├── index.ts
│   │   ├── auth.service.ts
│   │   └── api.service.ts
│   ├── stores/               # State management
│   │   ├── index.ts
│   │   ├── auth.store.ts
│   │   └── settings.store.ts
│   ├── types/                # TypeScript types
│   │   ├── index.ts
│   │   └── domain.ts
│   ├── utils/                # Utilities
│   │   ├── index.ts
│   │   ├── formatting.ts
│   │   └── validation.ts
│   ├── styles/               # Global styles
│   │   ├── globals.css
│   │   └── variables.css
│   └── config/               # App configuration
│       └── index.ts
├── public/                   # Static assets
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── .env.example
├── package.json
└── README.md
```

---

## Naming Conventions

### Variables & Functions
```typescript
// ✅ GOOD - descriptive, camelCase
const userEmail = 'user@example.com';
const isAuthenticated = true;
const getUserById = (id: string) => { /* ... */ };
const handleFormSubmit = () => { /* ... */ };
```

### Classes & Interfaces
```typescript
// ✅ GOOD - PascalCase
class UserService { /* ... */ }
interface IUser { /* ... */ }
type UserRole = 'admin' | 'user';
enum UserStatus { ACTIVE = 'ACTIVE' }
```

### Files & Folders
```
// ✅ GOOD
src/
├── services/
│   └── user.service.ts
├── models/
│   └── user.model.ts
├── controllers/
│   └── user.controller.ts
├── types/
│   └── user.types.ts
```

### Constants
```typescript
// ✅ GOOD - UPPER_SNAKE_CASE
const MAX_PASSWORD_LENGTH = 128;
const DEFAULT_TIMEOUT = 5000;
const API_RATE_LIMIT = 100; // requests per minute
```

---

## Testing Guidelines

### Unit Tests
```typescript
describe('UserService', () => {
  let service: UserService;
  let db: MockDatabase;

  beforeEach(() => {
    db = new MockDatabase();
    service = new UserService(db);
  });

  describe('createUser', () => {
    it('should create a user with valid email', async () => {
      const user = await service.createUser({
        email: 'test@example.com',
        name: 'Test User',
        password: 'SecurePassword123!'
      });

      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
    });

    it('should throw error for invalid email', async () => {
      const result = service.createUser({
        email: 'invalid-email',
        name: 'Test',
        password: 'Password123!'
      });

      await expect(result).rejects.toThrow('Invalid email');
    });

    it('should hash password before storing', async () => {
      await service.createUser({
        email: 'test@example.com',
        name: 'Test',
        password: 'PlainPassword'
      });

      const stored = db.users[0];
      expect(stored.password).not.toBe('PlainPassword');
      expect(await service.verifyPassword('PlainPassword', stored.password)).toBe(true);
    });
  });
});
```

### Integration Tests
```typescript
describe('Auth API', () => {
  let app: Express;
  let db: Database;

  beforeEach(async () => {
    app = createApp();
    db = await setupTestDatabase();
  });

  afterEach(async () => {
    await cleanupTestDatabase();
  });

  it('should register new user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'newuser@example.com',
        name: 'New User',
        password: 'SecurePassword123!'
      });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe('newuser@example.com');
    expect(response.body.token).toBeDefined();
  });

  it('should prevent duplicate email registration', async () => {
    await createUser('test@example.com');

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        name: 'Another User',
        password: 'Password123!'
      });

    expect(response.status).toBe(409);
    expect(response.body.error).toContain('Email already exists');
  });
});
```

---

## Environment Variables

### Always Use Environment Variables For:
- API keys and secrets
- Database URLs
- Service endpoints
- Feature flags
- Environment-specific settings

### Template (.env.example)
```env
# Never commit actual secrets!
# Always create .env.example with placeholder values

# Database
DATABASE_URL=mongodb+srv://user:password@host/database

# APIs
GEMINI_API_KEY=your_key_here
GITHUB_CLIENT_ID=your_id_here

# Features
ENABLE_PAYMENTS=false
ENABLE_REAL_TIME=true

# Environment
NODE_ENV=development
LOG_LEVEL=debug
```

### Loading in Code
```typescript
// config/index.ts
export const config = {
  database: {
    url: process.env.DATABASE_URL,
    poolSize: parseInt(process.env.DB_POOL_SIZE || '10')
  },
  api: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY
    }
  },
  features: {
    payments: process.env.ENABLE_PAYMENTS === 'true',
    realTime: process.env.ENABLE_REAL_TIME === 'true'
  }
};

// Validate on startup
if (!config.database.url) {
  throw new Error('DATABASE_URL is required');
}
```

---

## Performance Guidelines

### Frontend
```typescript
// ✅ Lazy load components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// ✅ Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeValue(data);
}, [data]);

// ✅ Debounce search inputs
const handleSearch = useCallback(
  debounce((query: string) => {
    performSearch(query);
  }, 300),
  []
);

// ✅ Use virtualization for long lists
<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={50}
>
  {renderRow}
</FixedSizeList>
```

### Backend
```typescript
// ✅ Use database indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.projects.createIndex({ userId: 1, createdAt: -1 });

// ✅ Implement query pagination
async function getUsers(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    db.users.find().skip(skip).limit(limit),
    db.users.countDocuments()
  ]);
  
  return { data, total, pages: Math.ceil(total / limit) };
}

// ✅ Cache frequently accessed data
const cachedSettings = await cache.get('settings');
if (!cachedSettings) {
  const settings = await db.settings.find();
  await cache.set('settings', settings, 3600); // 1 hour TTL
}

// ✅ Use connection pooling
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

---

## Security Guidelines

### 1. Input Validation
```typescript
// ✅ GOOD
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(100)
});

async function handleCreateUser(req: Request) {
  const validated = createUserSchema.parse(req.body);
  return userService.create(validated);
}
```

### 2. SQL Injection Prevention
```typescript
// ❌ BAD
db.query(`SELECT * FROM users WHERE email = '${email}'`);

// ✅ GOOD
db.query('SELECT * FROM users WHERE email = ?', [email]);
```

### 3. Passwords
```typescript
// ✅ GOOD - Hash before storing
import bcrypt from 'bcrypt';

const hashedPassword = await bcrypt.hash(password, 10);
await db.users.create({ email, password: hashedPassword });

// Never log passwords
logger.info('User created', { email }); // NOT { email, password }
```

### 4. Authentication Headers
```typescript
// ✅ GOOD - Check auth token
const token = req.headers.authorization?.split(' ')[1];
if (!token) {
  return res.status(401).json({ error: 'Unauthorized' });
}

const user = await verifyToken(token);
req.user = user;
```

### 5. Rate Limiting
```typescript
// ✅ GOOD
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.post('/api/v1/auth/login', limiter, authController.login);
```

---

## Documentation Standards

### Code Comments
```typescript
// ✅ GOOD - Explains WHY, not WHAT
// We retry after 100ms instead of immediately because
// the service typically needs time to recover from errors
async function fetchWithRetry(url: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(100 * (i + 1));
    }
  }
}

// ❌ BAD - States the obvious
// Get the user by ID
function getUser(id: string) { }
```

### Function Documentation
```typescript
/**
 * Generates a resume using AI
 * 
 * @param userId - The ID of the user generating the resume
 * @param style - The resume style ('professional', 'creative', 'minimal')
 * @returns Promise resolving to the generated resume content
 * 
 * @throws {Error} If user not found or AI generation fails
 * 
 * @example
 * const resume = await generateResume('user123', 'professional');
 * console.log(resume);
 */
async function generateResume(
  userId: string,
  style: 'professional' | 'creative' | 'minimal' = 'professional'
): Promise<string> {
  // Implementation
}
```

### README Guidelines

Every package should have a README with:
- [ ] Description
- [ ] Installation instructions
- [ ] Usage examples
- [ ] API documentation
- [ ] Configuration options
- [ ] Testing instructions
- [ ] Contributing guidelines
- [ ] License

---

## Commit Standards

### Commit Message Format
```
type(scope): subject

body

footer
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (no logic change)
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Test-related
- `chore` - Build/dependency

**Examples:**
```
feat(auth): add Google OAuth support

Allow users to authenticate using their Google accounts.
This implements the Google OAuth 2.0 flow.

Closes #123

fix(api): handle null pointer in getUser
docs(readme): add setup instructions
refactor(ai-gateway): extract provider logic to separate file
```

---

## Code Review Checklist

Before submitting a PR, ensure:

- [ ] Code follows naming conventions
- [ ] All functions have TypeScript types
- [ ] Error handling is implemented
- [ ] Environment variables used for config
- [ ] No hardcoded secrets
- [ ] Tests written and passing
- [ ] Code formatted with Prettier
- [ ] ESLint passes
- [ ] No console.log in production code
- [ ] README updated if needed
- [ ] Commit messages are clear
- [ ] No unnecessary dependencies added

---

## Anti-Patterns to Avoid

```typescript
// ❌ Global state
let currentUser: User;
function processRequest() {
  // Dangerous - depends on global state
}

// ✅ Pass dependencies
function processRequest(user: User) {
  // Safe - explicit dependencies
}

// ❌ Callback hell
function getData(callback: Function) {
  fetchA(() => {
    fetchB(() => {
      fetchC(() => {
        callback();
      });
    });
  });
}

// ✅ Async/await or promises
async function getData() {
  const a = await fetchA();
  const b = await fetchB();
  const c = await fetchC();
  return { a, b, c };
}

// ❌ Try-catch black holes
try {
  doSomething();
} catch (error) {
  // Error swallowed silently
}

// ✅ Handle errors explicitly
try {
  doSomething();
} catch (error) {
  logger.error('Failed to do something', error);
  throw new UserFriendlyError('Operation failed');
}
```

---

## Pre-Commit Checklist

Run before pushing:

```bash
# Format code
pnpm format

# Run linter
pnpm lint

# Run tests
pnpm test

# Build
pnpm build

# Type check
pnpm type-check

# All should pass! ✅
```

---

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Clean Code Principles](https://refactoring.guru/refactoring)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Best Practices](https://react.dev/learn)

---

**Remember: Code is read far more often than it's written. Write for the next person who reads it.**

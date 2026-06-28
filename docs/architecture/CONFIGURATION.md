# Configuration Philosophy

## Core Principle

> **If something might change in the future, it should be configurable—not hardcoded.**

This document outlines what should be configurable and how to implement it.

---

## Configurability Levels

### Level 1: Environment Variables (Infrastructure)

**When to use:** Secrets, endpoints, API keys

```env
# Services
DATABASE_URL=mongodb+srv://...
REDIS_URL=redis://...
ELASTICSEARCH_URL=http://...

# APIs
GEMINI_API_KEY=...
GITHUB_CLIENT_ID=...
CLOUDINARY_API_KEY=...

# Deployment
VERCEL_TOKEN=...
RENDER_API_KEY=...

# Features
ENABLE_PAYMENTS=false
ENABLE_REAL_TIME=true
```

**Storage:** `.env.local` file (gitignored)

---

### Level 2: Database Configuration (Runtime Settings)

**When to use:** Business logic that changes per environment or user

**Examples:**
- Navigation menu structure
- Features per app
- Integration configurations
- Email templates
- Payment rates

```typescript
// settings table
{
  key: "navigation",
  value: { 
    items: [
      { label: "Portfolio", path: "/portfolio" },
      { label: "CRM", path: "/crm" },
      { label: "BuildHub", path: "/buildhub" }
    ]
  },
  scope: "global" // or "user" or "organization"
}

{
  key: "features.payments",
  value: { 
    enabled: false,
    provider: "stripe",
    apiKey: "sk_..."
  },
  scope: "global"
}

{
  key: "theme.colors",
  value: {
    primary: "#00FF00",
    secondary: "#FF00FF",
    accent: "#00FFFF"
  },
  scope: "user" // Per-user theming
}
```

**API Endpoint:**
```typescript
GET  /api/v1/settings/:key
PUT  /api/v1/settings/:key
GET  /api/v1/settings (list all)
```

---

### Level 3: Admin UI Configuration (User-Controlled)

**When to use:** UI customization, content management, integrations

**Examples:**
- Logo and branding
- Social media links
- Skills and services
- Project categories
- Blog categories
- Resume templates
- API integrations

**Admin Panel:**
```
Settings → General
  ├── Branding
  │   ├── Logo
  │   ├── Company name
  │   ├── Favicon
  │   └── Colors
  ├── Navigation
  │   ├── Add/remove menu items
  │   └── Reorder items
  └── Content
      ├── Homepage text
      ├── About section
      └── Contact info

Settings → Integrations
  ├── GitHub
  │   ├── Connect account
  │   └── Permissions
  ├── Cloudinary
  │   ├── API credentials
  │   └── Folders
  └── Email
      ├── SMTP settings
      └── Templates

Settings → Features
  ├── Portfolio
  ├── CRM
  ├── AI Studio
  └── Toggle per-feature settings

Settings → AI
  ├── Default provider (Gemini/OpenAI/Claude)
  ├── Model selection
  ├── Temperature
  ├── Max tokens
  └── Custom prompts
```

---

### Level 4: Object Manager (Schema Configuration)

**When to use:** Custom data structures with business-specific fields

```typescript
// Create custom object through UI
{
  name: "Portfolio",
  displayName: "My Portfolio",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Project Title"
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      label: "Description"
    },
    {
      name: "thumbnail",
      type: "file",
      required: false,
      label: "Thumbnail Image"
    },
    {
      name: "tags",
      type: "multiselect",
      required: false,
      options: ["React", "Node", "MongoDB", "Tailwind"],
      label: "Technologies"
    },
    {
      name: "client",
      type: "relationship",
      referenceTo: "Client",
      label: "Associated Client"
    }
  ],
  permissions: {
    create: ["admin", "owner"],
    read: ["admin", "owner", "public"],
    update: ["admin", "owner"],
    delete: ["admin"]
  }
}
```

**APIs Generated Automatically:**
```
POST   /api/v1/objects/Portfolio
GET    /api/v1/objects/Portfolio
GET    /api/v1/objects/Portfolio/:id
PUT    /api/v1/objects/Portfolio/:id
DELETE /api/v1/objects/Portfolio/:id
PATCH  /api/v1/objects/Portfolio/:id
```

---

## What Should NOT Be Configurable

### Core Architecture
- Authentication mechanism (always JWT + OAuth)
- API Gateway routing (hardcoded for performance)
- Database connection pooling
- Caching strategy

### Security Policies
- CORS configuration (set in code, config in env)
- Password requirements (set in code)
- Rate limiting rules (set in code)

### UI Components
- Component library (Shadcn UI)
- Animation framework (Framer Motion)
- CSS framework (Tailwind)

---

## Implementation Examples

### Example 1: Navigation Menu

**Hardcoded (❌ BAD):**
```typescript
// pages/layout.tsx - NEVER DO THIS
export const NAVIGATION = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
];
```

**Configurable (✅ GOOD):**
```typescript
// hooks/useNavigation.ts
export function useNavigation() {
  const { data: settings } = useQuery(
    ['settings', 'navigation'],
    () => fetch('/api/v1/settings/navigation').then(r => r.json())
  );
  
  return settings?.value?.items || [];
}

// pages/layout.tsx
export function Layout() {
  const navigation = useNavigation();
  
  return (
    <nav>
      {navigation.map(item => (
        <Link key={item.path} to={item.path}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
```

**Admin Configuration:**
```typescript
// admin/settings/navigation.tsx
export function NavigationSettings() {
  const [items, setItems] = useState([]);
  
  return (
    <div>
      <h2>Navigation Menu</h2>
      <DragDropList
        items={items}
        onAdd={(item) => saveNavigation([...items, item])}
        onRemove={(index) => saveNavigation(items.filter((_, i) => i !== index))}
        onReorder={(newOrder) => saveNavigation(newOrder)}
      />
    </div>
  );
}
```

---

### Example 2: Email Templates

**Hardcoded (❌ BAD):**
```typescript
// services/email.ts
const welcomeTemplate = `
  <h1>Welcome, {name}!</h1>
  <p>Thanks for joining us.</p>
`;
```

**Configurable (✅ GOOD):**
```typescript
// services/email.ts
async function getEmailTemplate(templateName: string) {
  const template = await db.settings.findOne({
    key: `email.templates.${templateName}`
  });
  
  return template?.value?.html;
}

async function sendWelcomeEmail(user: User) {
  const template = await getEmailTemplate('welcome');
  const html = fillTemplate(template, { name: user.name });
  
  await emailService.send({
    to: user.email,
    subject: 'Welcome!',
    html
  });
}
```

**Admin Configuration:**
```typescript
// admin/email-templates.tsx
export function EmailTemplates() {
  const [templates, setTemplates] = useState({
    welcome: '',
    passwordReset: '',
    notification: ''
  });
  
  return (
    <div>
      {Object.entries(templates).map(([name, html]) => (
        <EditorCard key={name} name={name}>
          <RichTextEditor
            value={html}
            onChange={(value) => {
              setTemplates({ ...templates, [name]: value });
              saveSetting(`email.templates.${name}`, { html: value });
            }}
          />
        </EditorCard>
      ))}
    </div>
  );
}
```

---

### Example 3: AI Settings

**Hardcoded (❌ BAD):**
```typescript
// services/ai.ts
const DEFAULT_MODEL = 'gemini-pro';
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_MAX_TOKENS = 2000;
```

**Configurable (✅ GOOD):**
```typescript
// services/ai.ts
async function getAIConfig() {
  const settings = await db.settings.findOne({
    key: 'ai.config'
  });
  
  return settings?.value || {
    provider: 'gemini',
    model: 'gemini-pro',
    temperature: 0.7,
    maxTokens: 2000
  };
}

async function generateContent(prompt: string) {
  const config = await getAIConfig();
  
  const response = await getAIProvider(config.provider).generate({
    prompt,
    model: config.model,
    temperature: config.temperature,
    maxTokens: config.maxTokens
  });
  
  return response;
}
```

**Admin Configuration:**
```typescript
// admin/ai-settings.tsx
export function AISettings() {
  const [config, setConfig] = useState({
    provider: 'gemini',
    model: 'gemini-pro',
    temperature: 0.7,
    maxTokens: 2000
  });
  
  return (
    <form onSubmit={() => saveSetting('ai.config', config)}>
      <Select label="Provider" value={config.provider}>
        <option>gemini</option>
        <option>openai</option>
        <option>claude</option>
      </Select>
      
      <Select label="Model" value={config.model}>
        <option>gemini-pro</option>
        <option>gemini-pro-vision</option>
      </Select>
      
      <Slider 
        label="Temperature" 
        min={0} 
        max={2} 
        step={0.1}
        value={config.temperature}
        onChange={(val) => setConfig({...config, temperature: val})}
      />
      
      <Input 
        label="Max Tokens"
        type="number"
        value={config.maxTokens}
        onChange={(val) => setConfig({...config, maxTokens: parseInt(val)})}
      />
      
      <button type="submit">Save Configuration</button>
    </form>
  );
}
```

---

## Configuration Management Best Practices

### 1. Caching Strategy

```typescript
// Cache settings in-memory with TTL
class SettingsCache {
  private cache = new Map<string, { value: any; expiresAt: number }>();
  private TTL = 5 * 60 * 1000; // 5 minutes

  async get(key: string) {
    const cached = this.cache.get(key);
    
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    const value = await db.settings.findOne({ key });
    
    if (value) {
      this.cache.set(key, {
        value: value.value,
        expiresAt: Date.now() + this.TTL
      });
    }

    return value?.value;
  }

  invalidate(key: string) {
    this.cache.delete(key);
  }
}
```

### 2. Real-time Updates

```typescript
// When admin saves a setting, notify all clients
async function updateSetting(key: string, value: any) {
  await db.settings.updateOne({ key }, { value });
  
  // Invalidate cache
  settingsCache.invalidate(key);
  
  // Notify connected clients via WebSocket
  io.emit('settings:updated', { key, value });
  
  return value;
}

// Client-side
useEffect(() => {
  socket.on('settings:updated', ({ key, value }) => {
    queryClient.setQueryData(['settings', key], value);
  });
}, []);
```

### 3. Validation

```typescript
// Validate configuration before saving
const settingsSchema = {
  'theme.colors': {
    type: 'object',
    properties: {
      primary: { type: 'string', pattern: '^#[0-9A-F]{6}$' },
      secondary: { type: 'string', pattern: '^#[0-9A-F]{6}$' }
    }
  },
  'ai.config': {
    type: 'object',
    properties: {
      provider: { type: 'string', enum: ['gemini', 'openai', 'claude'] },
      temperature: { type: 'number', minimum: 0, maximum: 2 }
    }
  }
};

async function validateAndSaveSetting(key: string, value: any) {
  const schema = settingsSchema[key];
  
  if (!schema) {
    throw new Error(`Unknown setting: ${key}`);
  }

  const valid = ajv.validate(schema, value);
  
  if (!valid) {
    throw new Error(`Validation failed: ${ajv.errorsText()}`);
  }

  return updateSetting(key, value);
}
```

---

## Migration Path: Hardcoded → Configurable

### Step 1: Extract to Environment Variables
```typescript
const FEATURE_ENABLED = process.env.FEATURE_X_ENABLED === 'true';
```

### Step 2: Move to Database Settings
```typescript
const setting = await db.settings.findOne({ key: 'features.x' });
const FEATURE_ENABLED = setting?.value?.enabled ?? false;
```

### Step 3: Add Admin UI
```typescript
// admin/features.tsx
<ToggleSwitch 
  label="Enable Feature X"
  value={featureEnabled}
  onChange={(value) => updateSetting('features.x', { enabled: value })}
/>
```

### Step 4: Add Real-time Updates
```typescript
// Client subscribes to changes
useSubscription('settings:updated', { key: 'features.x' });
```

---

## Summary

| Level | Use Case | Storage | Access | Example |
|-------|----------|---------|--------|---------|
| **1** | Secrets & endpoints | `.env` file | Environment | `DATABASE_URL` |
| **2** | Runtime settings | Database | API | `theme.colors` |
| **3** | User content | Admin UI | Dashboard | `navigation.items` |
| **4** | Custom schema | Object Manager | Dynamic API | Custom objects |

Follow this hierarchy and your platform will be infinitely configurable!

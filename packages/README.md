# PV Platform Packages

Shared packages used across all PV Platform applications.

## Packages

### @pv/ui
Shared UI component library built with React and Tailwind CSS.

**Components:**
- `Button` - Reusable button component with variants
- `Input` - Form input with validation support
- `Card` - Card layout component with header, content, footer
- `Layout` - Layout components (Layout, Container, Header, Footer, Section, Grid)

**Usage:**
```tsx
import { Button, Input, Card, Layout } from '@pv/ui';
```

### @pv/hooks
Custom React hooks for common functionality.

**Hooks:**
- `useAuth` - Authentication state management
- `useSettings` - Dynamic settings management
- `useNavigation` - Navigation menu from settings
- `useDebounce` - Debounce values
- `useLocalStorage` - Persistent state in localStorage
- `useApi` - Generic API call hook

**Usage:**
```tsx
import { useAuth, useSettings, useDebounce } from '@pv/hooks';
```

### @pv/utils
Utility functions for common operations.

**Functions:**
- `formatDate`, `formatDateTime` - Date formatting
- `generateId` - Unique ID generation
- `slugify` - URL slug generation
- `truncate` - Text truncation
- `capitalizeFirst` - String capitalization
- `debounce`, `throttle` - Function rate limiting
- `isValidEmail`, `isValidUrl` - Validation
- `cn` - Class name merging
- `sleep`, `retry` - Async utilities
- `groupBy`, `omit`, `pick` - Object/array utilities

**Usage:**
```tsx
import { formatDate, slugify, cn, debounce } from '@pv/utils';
```

### @pv/types
TypeScript type definitions for the entire platform.

**Types:**
- User, Auth, Project, Skill, Experience
- Settings, Navigation
- API responses (ApiResponse, PaginatedResponse)
- AI types (AIConfig, ChatMessage)
- Object Manager types (ObjectType, ObjectField, etc.)
- App Registry types (App)
- Notification, Analytics types

**Usage:**
```tsx
import type { User, Project, AIConfig } from '@pv/types';
```

### @pv/api-client
Type-safe API client for communicating with PV Platform backend.

**Features:**
- Automatic token management
- Type-safe endpoints
- Error handling
- All API endpoints (Auth, Settings, Apps, Objects, Search, AI, Analytics, Notifications)

**Usage:**
```tsx
import { apiClient } from '@pv/api-client';

// Set token after login
apiClient.setToken(token);

// Make API calls
const user = await apiClient.getCurrentUser();
const projects = await apiClient.getObjects('Project');
```

### @pv/ai
AI service integration for Gemini, OpenAI, and Claude.

**Features:**
- Multi-provider support (Gemini, OpenAI, Claude)
- AI chat interface
- Content generation
- Resume generator
- Cover letter generator
- Career coach

**Usage:**
```tsx
import { aiService } from '@pv/ai';

// Chat with AI
const response = await aiService.chat('Hello!');

// Generate resume
const resume = await aiService.generateResume(userData, 'professional');

// Get career advice
const advice = await aiService.getCareerAdvice(userData, 'career growth');
```

## Installation

All packages are part of the monorepo and are automatically linked via pnpm workspaces.

```bash
# Install all dependencies
pnpm install
```

## Development

### Build all packages
```bash
pnpm build
```

### Build specific package
```bash
cd packages/[package-name]
pnpm build
```

### Development workflow
```bash
# Start development with all apps
pnpm dev

# Start specific app
pnpm dev --filter=portfolio
```

## Package Dependencies

```
@pv/ui
  └── (no dependencies)

@pv/hooks
  └── (no external dependencies)

@pv/utils
  └── (no external dependencies)

@pv/types
  └── (no external dependencies)

@pv/api-client
  ├── @pv/types
  └── @pv/utils

@pv/ai
  ├── @pv/types
  └── @pv/api-client
```

## Usage in Apps

### Portfolio App
```tsx
import { Button } from '@pv/ui';
import { useAuth } from '@pv/hooks';
import { formatDate } from '@pv/utils';
import type { User } from '@pv/types';
import { apiClient } from '@pv/api-client';
import { aiService } from '@pv/ai';
```

### Other Apps
All apps in the `apps/` directory can import from these packages.

## Contributing

When adding new shared functionality:

1. **UI Components** → Add to `@pv/ui`
2. **React Hooks** → Add to `@pv/hooks`
3. **Utility Functions** → Add to `@pv/utils`
4. **Type Definitions** → Add to `@pv/types`
5. **API Methods** → Add to `@pv/api-client`
6. **AI Features** → Add to `@pv/ai`

## Standards

- All packages must have TypeScript types
- All functions must have JSDoc comments
- All exports must be from index.ts
- Follow the development guidelines in `docs/architecture/DEVELOPMENT_GUIDELINES.md`
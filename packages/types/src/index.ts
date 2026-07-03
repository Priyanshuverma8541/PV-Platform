// User types
export interface User {
  id: string;
  email: string;
  username: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar: string;
    bio: string;
  };
  oauth?: {
    google?: {
      id: string;
      email: string;
    };
    github?: {
      id: string;
      username: string;
    };
  };
  settings: {
    twoFactorEnabled: boolean;
    emailNotifications: boolean;
    theme: 'light' | 'dark';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  username: string;
  password: string;
  profile?: {
    firstName: string;
    lastName: string;
  };
}

// Auth types
export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

// Project types
export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectInput {
  title: string;
  description: string;
  thumbnail?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

// Skill types
export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
  icon?: string;
}

export interface CreateSkillInput {
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
  icon?: string;
}

// Experience types
export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  technologies?: string[];
}

export interface CreateExperienceInput {
  title: string;
  company: string;
  location?: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  current?: boolean;
  technologies?: string[];
}

// Settings types
export interface Setting {
  key: string;
  value: any;
  scope: 'global' | 'user' | 'organization';
}

export interface NavigationItem {
  label: string;
  path: string;
  icon?: string;
  external?: boolean;
}

export interface NavigationSettings {
  items: NavigationItem[];
}

// API types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// AI types
export interface AIConfig {
  provider: 'gemini' | 'openai' | 'claude';
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
  topP?: number;
  topK?: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// Object Manager types
export interface ObjectType {
  id: string;
  name: string;
  displayName: string;
  plural: string;
  description: string;
  icon: string;
  fields: ObjectField[];
  relationships: ObjectRelationship[];
  permissions: ObjectPermissions;
  createdAt: Date;
  updatedAt: Date;
}

export interface ObjectField {
  name: string;
  displayName: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'checkbox' | 'select' | 'multiselect' | 'file' | 'relationship';
  required: boolean;
  unique: boolean;
  default?: any;
  options?: any[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  helpText?: string;
}

export interface ObjectRelationship {
  name: string;
  displayName: string;
  referenceTo: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

export interface ObjectPermissions {
  create: string[];
  read: string[];
  update: string[];
  delete: string[];
}

// App Registry types
export interface App {
  id: string;
  name: string;
  slug: string;
  displayName: string;
  description: string;
  icon: string;
  version: string;
  status: 'active' | 'inactive' | 'maintenance';
  endpoints: {
    frontend: string;
    backend: string;
    websocket?: string;
  };
  metadata: {
    author: string;
    homepage: string;
    repository: string;
  };
  features: {
    hasDatabase: boolean;
    hasCloudinaryFolder: boolean;
    requiresSubscription: boolean;
  };
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  subject: string;
  body: string;
  actionUrl?: string;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  sentAt?: Date;
}

// Analytics types
export interface AnalyticsEvent {
  id: string;
  userId: string;
  event: string;
  app?: string;
  objectType?: string;
  objectId?: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

// Mission Control / Dashboard types
export interface DashboardWidget {
  id: string;
  type: 'stat' | 'chart' | 'list' | 'calendar' | 'progress' | 'activity';
  title: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  data: any;
  refreshInterval?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  completedAt?: Date;
  tags: string[];
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  tags?: string[];
  projectId?: string;
}

// Career types
export interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'accepted';
  appliedDate: Date;
  source?: string;
  salary?: {
    min?: number;
    max?: number;
    currency: string;
  };
  location?: string;
  remote: boolean;
  notes?: string;
  interviews: Interview[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Interview {
  id: string;
  type: 'phone' | 'video' | 'onsite' | 'technical' | 'hr';
  date: Date;
  duration?: number;
  notes?: string;
  feedback?: string;
  interviewer?: string;
}

export interface Resume {
  id: string;
  title: string;
  content: any; // JSON resume format
  template: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Learning types
export interface Course {
  id: string;
  title: string;
  provider: string;
  description?: string;
  thumbnail?: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  enrolledAt: Date;
  completedAt?: Date;
  certificateUrl?: string;
  skills: string[];
}

export interface SkillProgress {
  skill: string;
  level: number;
  targetLevel: number;
  hoursSpent: number;
  lastPracticed: Date;
}

// CRM types
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  source: 'website' | 'referral' | 'social' | 'cold_outreach' | 'other';
  status: 'lead' | 'prospect' | 'customer' | 'partner' | 'inactive';
  tags: string[];
  notes?: string;
  interactions: Interaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Interaction {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  date: Date;
  summary: string;
  outcome?: string;
  nextSteps?: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  currency: string;
  stage: 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability: number;
  contactId: string;
  expectedCloseDate?: Date;
  closedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Finance types
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  currency: string;
  description: string;
  date: Date;
  projectId?: string;
  receipt?: string;
  tags: string[];
  createdAt: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: Date;
  dueDate: Date;
  paidAt?: Date;
  notes?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

// Blog types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
  publishedAt?: Date;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

// Notification types (enhanced)
export interface AppNotification {
  id: string;
  userId: string;
  app: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
}

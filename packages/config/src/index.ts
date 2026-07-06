import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Environment validation schema
const envSchema = z.object({
  // Database
  MONGODB_URI: z.string().url('Invalid MongoDB URI'),
  
  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
  
  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  
  // Service URLs
  API_GATEWAY_URL: z.string().url().default('http://localhost:3000'),
  AUTH_SERVICE_URL: z.string().url().default('http://localhost:4000'),
  PROJECT_SERVICE_URL: z.string().url().default('http://localhost:4001'),
  AI_SERVICE_URL: z.string().url().default('http://localhost:4002'),
  MEDIA_SERVICE_URL: z.string().url().default('http://localhost:4003'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  
  // AI Services
  GEMINI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  
  // OAuth
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  
  // Email
  EMAIL_SERVICE: z.string().optional(),
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.coerce.number().optional(),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  
  // Frontend URLs
  ADMIN_URL: z.string().url().default('http://localhost:5174'),
  PORTFOLIO_URL: z.string().url().default('http://localhost:5173'),
});

// Validate environment variables
export const env = envSchema.parse(process.env);

// Export individual configs
export const databaseConfig = {
  uri: env.MONGODB_URI,
  options: {
    maxPoolSize: 10,
    minPoolSize: 5,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000,
  },
};

export const jwtConfig = {
  secret: env.JWT_SECRET,
  expiresIn: env.JWT_EXPIRES_IN,
};

export const serverConfig = {
  env: env.NODE_ENV,
  port: env.PORT,
  host: env.HOST,
};

export const corsConfig = {
  origin: env.CORS_ORIGIN.split(',').map(origin => origin.trim()),
  credentials: true,
};

export const rateLimitConfig = {
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
};

export const cloudinaryConfig = {
  cloudName: env.CLOUDINARY_CLOUD_NAME,
  apiKey: env.CLOUDINARY_API_KEY,
  apiSecret: env.CLOUDINARY_API_SECRET,
};

export const aiConfig = {
  gemini: {
    apiKey: env.GEMINI_API_KEY,
  },
  openai: {
    apiKey: env.OPENAI_API_KEY,
  },
  anthropic: {
    apiKey: env.ANTHROPIC_API_KEY,
  },
};

export const oauthConfig = {
  github: {
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
  },
  google: {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  },
};

export const emailConfig = {
  service: env.EMAIL_SERVICE,
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  user: env.EMAIL_USER,
  password: env.EMAIL_PASSWORD,
  from: env.EMAIL_FROM,
};

export const frontendUrls = {
  admin: env.ADMIN_URL,
  portfolio: env.PORTFOLIO_URL,
};

// Service URLs
export const serviceUrls = {
  apiGateway: env.API_GATEWAY_URL,
  auth: env.AUTH_SERVICE_URL,
  project: env.PROJECT_SERVICE_URL,
  ai: env.AI_SERVICE_URL,
  media: env.MEDIA_SERVICE_URL,
};

// Helper to check if we're in development
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
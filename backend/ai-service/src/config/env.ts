import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

// Load root .env from repo root (4 levels up from src/config/)
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../../../.env') });
dotenv.config(); // local .env override

function require(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env variable: ${key}`);
  return val;
}

const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.AI_SERVICE_PORT ?? 5000),
  JWT_SECRET: require('JWT_SECRET'),
  CLIENT_URL: process.env.CLIENT_URL ?? 'http://localhost:5173',

  // AI providers — only GEMINI_API_KEY is required; others are optional
  AI_PROVIDER: (process.env.AI_PROVIDER ?? 'gemini') as 'gemini' | 'openai' | 'claude',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? '',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ?? '',

  // MongoDB — for storing ai_chats, ai_usage, ai_history
  DATABASE_URL: process.env.DATABASE_URL ?? process.env.MONGO_URI ?? '',

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000),
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX ?? 20),
};

export default env;

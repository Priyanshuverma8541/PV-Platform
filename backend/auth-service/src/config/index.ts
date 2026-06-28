import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

// Load root .env first (absolute path, works in both dev and built)
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootEnvPath = resolve(__dirname, '../../../../.env');
dotenv.config({ path: rootEnvPath });
// Then load any local .env (overrides root)
dotenv.config();

const requiredEnv = [
  'JWT_SECRET',
  'CLIENT_URL',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const databaseUrl = process.env.DATABASE_URL ?? process.env.MONGO_URI;
if (!databaseUrl) {
  throw new Error('Missing required environment variable: DATABASE_URL or MONGO_URI');
}

const config = {
  PORT: Number(process.env.AUTH_SERVICE_PORT ?? process.env.PORT ?? 4000),
  DATABASE_URL: databaseUrl,
  JWT_SECRET: process.env.JWT_SECRET as string,
  CLIENT_URL: process.env.CLIENT_URL as string,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID as string,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET as string,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
};

export default config;
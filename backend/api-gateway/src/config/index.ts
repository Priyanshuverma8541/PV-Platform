import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootEnvPath = resolve(__dirname, '../../../../.env');
dotenv.config({ path: rootEnvPath });
dotenv.config();

const requiredEnv = ['CLIENT_URL', 'AUTH_SERVICE_URL', 'JWT_SECRET'];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

const config = {
  PORT: Number(process.env.API_GATEWAY_PORT ?? process.env.PORT ?? 3000),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  CLIENT_URL: process.env.CLIENT_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL as string,
  AI_SERVICE_URL: process.env.AI_SERVICE_URL as string,
  MEDIA_SERVICE_URL: process.env.MEDIA_SERVICE_URL as string,
  NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL as string,
  SEARCH_SERVICE_URL: process.env.SEARCH_SERVICE_URL as string,
  ANALYTICS_SERVICE_URL: process.env.ANALYTICS_SERVICE_URL as string,
};

export default config;
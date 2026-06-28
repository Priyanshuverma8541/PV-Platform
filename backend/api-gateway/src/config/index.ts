import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootEnvPath = resolve(__dirname, '../../../../.env');
dotenv.config({ path: rootEnvPath });
dotenv.config();

const requiredEnv = ['CLIENT_URL', 'AUTH_SERVICE_URL'];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

const config = {
  PORT: Number(process.env.API_GATEWAY_PORT ?? process.env.PORT ?? 3000),
  CLIENT_URL: process.env.CLIENT_URL as string,
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL as string,
};

export default config;
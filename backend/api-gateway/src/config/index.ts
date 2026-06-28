import dotenv from 'dotenv';

dotenv.config({ path: new URL('../../../../.env', import.meta.url) });
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

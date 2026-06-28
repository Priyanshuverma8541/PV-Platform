import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = ['PORT', 'CLIENT_URL', 'AUTH_SERVICE_URL'];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

const config = {
  PORT: Number(process.env.PORT ?? 3000),
  CLIENT_URL: process.env.CLIENT_URL as string,
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL as string,
};

export default config;

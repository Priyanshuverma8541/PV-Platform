import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootEnvPath = resolve(__dirname, '../../../../.env');
dotenv.config({ path: rootEnvPath });
dotenv.config();

const requiredEnv = [
  'DATABASE_URL',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'JWT_SECRET'
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const config = {
  PORT: Number(process.env.MEDIA_SERVICE_PORT ?? process.env.PORT ?? 5001),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  DATABASE_URL: process.env.DATABASE_URL ?? process.env.MONGO_URI ?? '',
  JWT_SECRET: process.env.JWT_SECRET as string,
  CLIENT_URL: process.env.CLIENT_URL ?? 'http://localhost:5173',

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,

  // File upload limits
  MAX_FILE_SIZE: Number(process.env.MAX_FILE_SIZE ?? 10 * 1024 * 1024), // 10MB
  ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES ?? 'image/jpeg,image/png,image/gif,image/webp,application/pdf').split(','),

  // Thumbnail generation
  THUMBNAIL_WIDTH: Number(process.env.THUMBNAIL_WIDTH ?? 300),
  THUMBNAIL_HEIGHT: Number(process.env.THUMBNAIL_HEIGHT ?? 300),
};

export default config;
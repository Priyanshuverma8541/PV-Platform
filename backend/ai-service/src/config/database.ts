import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export async function connectDatabase(uri: string): Promise<void> {
  if (!uri) {
    logger.warn('DATABASE_URL not set — AI service running without persistent storage');
    return;
  }
  await mongoose.connect(uri);
  logger.info('AI Service connected to MongoDB');
}

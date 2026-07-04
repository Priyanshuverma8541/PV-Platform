import env from './config/env';
import { connectDatabase } from './config/database';
import app from './app';
import logger from './utils/logger';

async function start() {
  await connectDatabase(env.DATABASE_URL);

  app.listen(env.PORT, () => {
    logger.info(`AI Service running on http://localhost:${env.PORT}`);
    logger.info(`AI Provider: ${env.AI_PROVIDER}`);
    logger.info(`Environment: ${env.NODE_ENV}`);
  });
}

start().catch((err) => {
  logger.error('Failed to start AI Service', err);
  process.exit(1);
});

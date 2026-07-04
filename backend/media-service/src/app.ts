import express from 'express';
import cors from 'cors';
import config from './config/index';
import logger from './utils/logger';
import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/error';
import { authMiddleware } from './middleware/auth';
import { rateLimiter } from './middleware/rateLimiter';
import { requestLogger } from './middleware/requestLogger';
import mediaRoutes from './routes/media.routes';
import { eventBus, EventTypes } from 'pv-core';

const app = express();

// Middleware
app.use(cors({
  origin: config.CLIENT_URL,
  credentials: true,
}));

app.use(express.json());

// Request logging
app.use(requestLogger);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Media service is healthy',
    data: {
      service: 'media-service',
      timestamp: new Date().toISOString()
    },
    timestamp: new Date().toISOString(),
    requestId: (_req as any).requestId
  });
});

// Media routes
app.use('/api/media', mediaRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    errors: [`Cannot ${req.method} ${req.path}`],
    timestamp: new Date().toISOString(),
    requestId: (req as any).requestId
  });
});

// Start server
const startServer = async (): Promise<void> => {
  try {
    await connectDatabase(config.DATABASE_URL);

    const PORT = config.PORT;
    app.listen(PORT, () => {
      logger.info(`Media service listening on http://localhost:${PORT}`);
      console.log(`Media service listening on http://localhost:${PORT}`);

      // Emit startup event
      eventBus.emit({
        type: EventTypes.SERVICE_STARTED,
        payload: {
          service: 'media-service',
          port: PORT,
          version: process.env.npm_package_version || '1.0.0'
        },
        metadata: {
          source: 'media-service'
        }
      }).catch(err => logger.warn('Failed to emit startup event', { error: err }));
    });
  } catch (error) {
    logger.error('Failed to start media service', { error });
    process.exit(1);
  }
};

startServer();

export default app;


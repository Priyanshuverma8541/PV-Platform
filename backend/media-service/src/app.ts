import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import logger from './utils/logger.js';
import { connectDatabase } from './config/database.js';
import { errorHandler } from './middleware/error.js';
import { authMiddleware } from './middleware/auth.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { requestLogger } from './middleware/requestLogger.js';
import mediaRoutes from './routes/media.routes.js';
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
    requestId: (req as any).requestId
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
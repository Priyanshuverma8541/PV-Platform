import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { eventBus, EventTypes } from 'pv-core';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/error.js';
import { authMiddleware } from './middleware/auth.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { requestLogger } from './middleware/requestLogger.js';
import { validateRequest } from './middleware/validation.js';
import config from './config/index.js';

dotenv.config();

const app = express();
const PORT = config.PORT;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.CLIENT_URL,
  credentials: true,
}));

// Body parsing - only for non-proxied routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API Gateway is healthy',
    data: {
      service: 'api-gateway',
      version: process.env.npm_package_version || '1.0.0',
      timestamp: new Date().toISOString()
    },
    timestamp: new Date().toISOString(),
    requestId: _req.requestId
  });
});

// API versioning
app.use('/api/v1', rateLimiter, authMiddleware);

// Service routes with authentication and rate limiting
app.use('/api/v1/auth',
  validateRequest('auth'),
  createProxyMiddleware({
    target: config.AUTH_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use('/api/v1/ai',
  validateRequest('ai'),
  createProxyMiddleware({
    target: config.AI_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use('/api/v1/media',
  validateRequest('media'),
  createProxyMiddleware({
    target: config.MEDIA_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use('/api/v1/notifications',
  validateRequest('notifications'),
  createProxyMiddleware({
    target: config.NOTIFICATION_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use('/api/v1/search',
  validateRequest('search'),
  createProxyMiddleware({
    target: config.SEARCH_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use('/api/v1/analytics',
  validateRequest('analytics'),
  createProxyMiddleware({
    target: config.ANALYTICS_SERVICE_URL,
    changeOrigin: true,
  })
);

// Application service routes (Phase 2-5)
const appServices = [
  'portfolio',
  'career',
  'resume',
  'learning',
  'crm',
  'finance',
  'marketplace',
  'blog',
  'buildhub'
];

appServices.forEach(service => {
  const serviceUrl = process.env[`${service.toUpperCase()}_SERVICE_URL`];
  if (serviceUrl) {
    app.use(`/api/v1/${service}`,
      validateRequest(service),
      createProxyMiddleware({
        target: serviceUrl,
        changeOrigin: true,
      })
    );
  }
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    errors: [`Cannot ${req.method} ${req.path}`],
    timestamp: new Date().toISOString(),
    requestId: req.requestId
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`API Gateway listening on http://localhost:${PORT}`);
  console.log(`API Gateway listening on http://localhost:${PORT}`);

  // Emit startup event
  eventBus.emit({
    type: EventTypes.SERVICE_STARTED,
    payload: {
      service: 'api-gateway',
      port: PORT,
      version: process.env.npm_package_version || '1.0.0'
    },
    metadata: {
      source: 'api-gateway'
    }
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await eventBus.emit({
    type: 'service.shutdown',
    payload: { service: 'api-gateway' },
    metadata: { source: 'api-gateway' }
  });
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  await eventBus.emit({
    type: 'service.shutdown',
    payload: { service: 'api-gateway' },
    metadata: { source: 'api-gateway' }
  });
  process.exit(0);
});

export default app;
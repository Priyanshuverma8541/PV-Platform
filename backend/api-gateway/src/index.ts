import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { env, corsConfig, rateLimitConfig } from '@pv/config';
import { logger } from '@pv/utils';
import { errorHandler } from './middleware/error';

const app = express();
const PORT = env.PORT || 3000;

// Middleware
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: rateLimitConfig.windowMs,
  max: rateLimitConfig.max,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});

app.use('/api', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'api-gateway',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Proxy routes to backend services
const services = {
  auth: env.AUTH_SERVICE_URL || 'http://localhost:4000',
  project: env.PROJECT_SERVICE_URL || 'http://localhost:4001',
  ai: env.AI_SERVICE_URL || 'http://localhost:4002',
  media: env.MEDIA_SERVICE_URL || 'http://localhost:4003',
};

// Auth service proxy
app.use('/api/auth', createProxyMiddleware({
  target: services.auth,
  changeOrigin: true,
  logger,
  onProxyReq: (proxyReq) => {
    logger.info(`Proxying ${proxyReq.method} ${proxyReq.path} to auth-service`);
  },
}));

// Project service proxy
app.use('/api/projects', createProxyMiddleware({
  target: services.project,
  changeOrigin: true,
  logger,
  onProxyReq: (proxyReq) => {
    logger.info(`Proxying ${proxyReq.method} ${proxyReq.path} to project-service`);
  },
}));

// AI service proxy
app.use('/api/ai', createProxyMiddleware({
  target: services.ai,
  changeOrigin: true,
  logger,
  onProxyReq: (proxyReq) => {
    logger.info(`Proxying ${proxyReq.method} ${proxyReq.path} to ai-service`);
  },
}));

// Media service proxy
app.use('/api/media', createProxyMiddleware({
  target: services.media,
  changeOrigin: true,
  logger,
  onProxyReq: (proxyReq) => {
    logger.info(`Proxying ${proxyReq.method} ${proxyReq.path} to media-service`);
  },
}));

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    const server = app.listen(PORT, () => {
      logger.info(`🚀 API Gateway running on port ${PORT}`);
      logger.info(`📍 Environment: ${env.NODE_ENV}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
      logger.info(`📡 Proxying to:`);
      logger.info(`   - Auth: ${services.auth}`);
      logger.info(`   - Project: ${services.project}`);
      logger.info(`   - AI: ${services.ai}`);
      logger.info(`   - Media: ${services.media}`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('🛑 Shutting down gracefully...');
      server.close(() => {
        logger.info('✅ Server closed');
        process.exit(0);
      });
    });

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start if run directly
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
export { startServer };
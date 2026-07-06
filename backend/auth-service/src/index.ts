import express from 'express';
import cors from 'cors';
import { connectDatabase } from '@pv/database';
import { env, corsConfig, serverConfig, rateLimitConfig } from '@pv/config';
import { logger } from '@pv/utils';
import authRoutes from './routes/auth.routes';
import oauthRoutes from './routes/oauth.routes';

const app = express();
const PORT = env.PORT || 4000;

// Middleware
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/oauth', oauthRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'auth-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start listening
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Auth Service running on port ${PORT}`);
      logger.info(`📍 Environment: ${env.NODE_ENV}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
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
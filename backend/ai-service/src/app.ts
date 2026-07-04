import express from 'express';
import cors from 'cors';
import env from './config/env';
import logger from './utils/logger';

import chatRoutes from './routes/chat.routes';
import resumeRoutes from './routes/resume.routes';
import proposalRoutes from './routes/proposal.routes';
import portfolioRoutes from './routes/portfolio.routes';
import buildhubRoutes from './routes/buildhub.routes';
import researchRoutes from './routes/research.routes';
import usageRoutes from './routes/usage.routes';

const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));

// ── Request logger ──
app.use((req, _res, next) => {
  logger.debug(`${req.method} ${req.path}`);
  next();
});

// ── Health check ── (no auth — used by api-gateway and Docker health checks)
app.get('/', (_req, res) => res.json({ status: 'ok', service: 'ai-service', provider: env.AI_PROVIDER }));
app.get('/health', (_req, res) => res.json({ status: 'healthy' }));

// ── AI Routes ──
// POST /api/ai/chat                    — General AI assistant
// POST /api/ai/chat/history/:sessionId — Chat history
// POST /api/ai/resume/generate         — Resume generator
// POST /api/ai/resume/cover-letter     — Cover letter generator
// POST /api/ai/proposal                — Freelance proposal
// POST /api/ai/proposal/email          — Email generator
// POST /api/ai/portfolio/review        — Portfolio analyzer
// POST /api/ai/buildhub/generate       — Software generation
// POST /api/ai/research                — Research assistant
// POST /api/ai/research/career         — Career coach
// POST /api/ai/research/crm            — CRM assistant
// POST /api/ai/research/code           — Code reviewer
// GET  /api/ai/usage                   — Usage analytics (Mission Control)
// GET  /api/ai/usage/chats             — Chat history list

app.use('/api/ai/chat', chatRoutes);
app.use('/api/ai/resume', resumeRoutes);
app.use('/api/ai/proposal', proposalRoutes);
app.use('/api/ai/portfolio', portfolioRoutes);
app.use('/api/ai/buildhub', buildhubRoutes);
app.use('/api/ai/research', researchRoutes);
app.use('/api/ai/usage', usageRoutes);

// ── Error handler ──
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error', { message: err.message, stack: err.stack });

  // Don't leak internal errors in production
  const isDev = env.NODE_ENV === 'development';
  res.status(500).json({
    message: isDev ? err.message : 'Internal server error. Please try again.',
    ...(isDev && { stack: err.stack }),
  });
});

export default app;

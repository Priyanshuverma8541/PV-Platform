import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { routeAIRequest } from '../services/aiRouter.service.js';
import { buildPrompt } from '../services/prompt.service.js';
import type { AuthenticatedRequest } from '../types/index.js';
import type { Response, NextFunction } from 'express';

const router = Router();

router.post('/review', requireAuth, aiRateLimiter, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = req.body as Record<string, unknown>;
    const { userPrompt, systemPrompt } = buildPrompt({ feature: 'portfolio_review', data });
    const result = await routeAIRequest({ prompt: userPrompt, systemPrompt, userId: req.user?.userId, feature: 'portfolio_review' });
    res.json({ review: result.content, provider: result.provider });
  } catch (error) { next(error); }
});

export default router;

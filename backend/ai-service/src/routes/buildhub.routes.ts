import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { strictRateLimiter } from '../middleware/rateLimiter';
import { routeAIRequest } from '../services/aiRouter.service';
import { buildPrompt } from '../services/prompt.service';
import type { AuthenticatedRequest } from '../types/index';
import type { Response, NextFunction } from 'express';

const router = Router();

router.post('/generate', requireAuth, strictRateLimiter, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = req.body as Record<string, unknown>;
    if (!data.description) return res.status(400).json({ message: 'description is required.' });
    const { userPrompt, systemPrompt } = buildPrompt({ feature: 'buildhub', data });
    const result = await routeAIRequest({ prompt: userPrompt, systemPrompt, userId: req.user?.userId, feature: 'buildhub' });
    res.json({ generated: result.content, type: data.type, provider: result.provider });
  } catch (error) { next(error); }
});

export default router;

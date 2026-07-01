import type { Response, NextFunction } from 'express';
import { routeAIRequest } from '../services/aiRouter.service.js';
import { buildPrompt } from '../services/prompt.service.js';
import type { AuthenticatedRequest } from '../types/index.js';

export async function generateProposal(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const data = req.body as Record<string, unknown>;

    if (!data.projectDescription) {
      return res.status(400).json({ message: 'projectDescription is required.' });
    }

    const { userPrompt, systemPrompt } = buildPrompt({ feature: 'proposal', data });

    const result = await routeAIRequest({
      prompt: userPrompt,
      systemPrompt,
      userId: req.user?.userId,
      feature: 'proposal',
    });

    res.json({ proposal: result.content, provider: result.provider });
  } catch (error) {
    next(error);
  }
}

export async function generateEmail(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const data = req.body as Record<string, unknown>;

    if (!data.context) {
      return res.status(400).json({ message: 'context is required.' });
    }

    const { userPrompt, systemPrompt } = buildPrompt({ feature: 'email', data });

    const result = await routeAIRequest({
      prompt: userPrompt,
      systemPrompt,
      userId: req.user?.userId,
      feature: 'email',
    });

    res.json({ email: result.content, provider: result.provider });
  } catch (error) {
    next(error);
  }
}

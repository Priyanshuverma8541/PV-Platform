import type { Response, NextFunction } from 'express';
import { routeAIRequest } from '../services/aiRouter.service.js';
import { buildPrompt } from '../services/prompt.service.js';
import type { AuthenticatedRequest } from '../types/index.js';

export async function generateResume(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const data = req.body as Record<string, unknown>;

    if (!data.name && !data.role) {
      return res.status(400).json({ message: 'At minimum, provide name and role.' });
    }

    const { userPrompt, systemPrompt } = buildPrompt({ feature: 'resume', data });

    const result = await routeAIRequest({
      prompt: userPrompt,
      systemPrompt,
      userId: req.user?.userId,
      feature: 'resume',
      metadata: { targetRole: data.targetRole },
    });

    res.json({
      resume: result.content,
      provider: result.provider,
      model: result.model,
    });
  } catch (error) {
    next(error);
  }
}

export async function generateCoverLetter(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { jobTitle, company, jobDescription, myBackground } = req.body as Record<string, string>;

    if (!jobTitle || !company) {
      return res.status(400).json({ message: 'jobTitle and company are required.' });
    }

    const { userPrompt, systemPrompt } = buildPrompt({
      feature: 'cover_letter',
      data: {
        message: `Write a compelling cover letter for the position of ${jobTitle} at ${company}.
Job Description: ${jobDescription ?? 'Not provided'}
My Background: ${myBackground ?? 'Not provided'}
Keep it under 300 words. Professional, confident, and tailored to the role.`,
      },
    });

    const result = await routeAIRequest({
      prompt: userPrompt,
      systemPrompt,
      userId: req.user?.userId,
      feature: 'cover_letter',
    });

    res.json({ coverLetter: result.content, provider: result.provider });
  } catch (error) {
    next(error);
  }
}

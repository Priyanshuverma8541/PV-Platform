import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { aiRateLimiter } from '../middleware/rateLimiter';
import { routeAIRequest } from '../services/aiRouter.service';
import { buildPrompt } from '../services/prompt.service';
import type { AuthenticatedRequest } from '../types/index';
import type { Response, NextFunction } from 'express';

const router = Router();

// Research assistant
router.post('/', requireAuth, aiRateLimiter, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { topic, depth } = req.body as { topic: string; depth?: string };
    if (!topic) return res.status(400).json({ message: 'topic is required.' });
    const result = await routeAIRequest({
      prompt: `Research the following topic and provide a comprehensive, structured summary:\n\nTopic: ${topic}\nDepth: ${depth ?? 'detailed'}\n\nProvide: Overview, Key Points, Latest Trends, Practical Implications, and Further Reading suggestions.`,
      systemPrompt: 'You are an expert research assistant. Provide well-structured, accurate, and insightful research summaries. Use clear headings, bullet points, and cite concepts clearly.',
      userId: req.user?.userId,
      feature: 'research',
    });
    res.json({ research: result.content, provider: result.provider });
  } catch (error) { next(error); }
});

// Career coach
router.post('/career', requireAuth, aiRateLimiter, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = req.body as Record<string, unknown>;
    const { userPrompt, systemPrompt } = buildPrompt({ feature: 'career_coach', data });
    const result = await routeAIRequest({ prompt: userPrompt, systemPrompt, userId: req.user?.userId, feature: 'career_coach' });
    res.json({ advice: result.content, provider: result.provider });
  } catch (error) { next(error); }
});

// CRM assistant
router.post('/crm', requireAuth, aiRateLimiter, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = req.body as Record<string, unknown>;
    const { userPrompt, systemPrompt } = buildPrompt({ feature: 'crm_assistant', data });
    const result = await routeAIRequest({ prompt: userPrompt, systemPrompt, userId: req.user?.userId, feature: 'crm_assistant' });
    res.json({ insights: result.content, provider: result.provider });
  } catch (error) { next(error); }
});

// Code review
router.post('/code', requireAuth, aiRateLimiter, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { code, language, focus } = req.body as { code: string; language?: string; focus?: string };
    if (!code) return res.status(400).json({ message: 'code is required.' });
    const result = await routeAIRequest({
      prompt: `Review the following ${language ?? ''} code:\n\n\`\`\`\n${code}\n\`\`\`\n\nFocus: ${focus ?? 'general quality, bugs, performance, and best practices'}`,
      systemPrompt: 'You are a senior software engineer doing a thorough code review. Identify bugs, suggest improvements, check for security issues, and provide specific actionable feedback with code examples.',
      userId: req.user?.userId,
      feature: 'code_review',
    });
    res.json({ review: result.content, provider: result.provider });
  } catch (error) { next(error); }
});

export default router;

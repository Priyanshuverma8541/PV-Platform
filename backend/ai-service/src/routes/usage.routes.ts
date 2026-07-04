import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { AIUsage, AIChat } from '../utils/models';
import type { AuthenticatedRequest } from '../types/index';
import type { Response, NextFunction } from 'express';

const router = Router();

/** GET /usage — user's own AI usage stats (for Mission Control dashboard) */
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const [usageByFeature, recentActivity, totalCounts] = await Promise.all([
      AIUsage.aggregate([
        { $match: { userId } },
        { $group: { _id: '$feature', count: { $sum: 1 }, totalTokens: { $sum: { $add: ['$inputTokens', '$outputTokens'] } } } },
        { $sort: { count: -1 } },
      ]),
      AIUsage.find({ userId }).sort({ createdAt: -1 }).limit(10).select('feature provider durationMs success createdAt'),
      AIUsage.countDocuments({ userId }),
    ]);

    res.json({ totalRequests: totalCounts, byFeature: usageByFeature, recentActivity });
  } catch (error) { next(error); }
});

/** GET /usage/chats — list of chat sessions */
router.get('/chats', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const chats = await AIChat.find({ userId: req.user!.userId })
      .sort({ updatedAt: -1 })
      .limit(20)
      .select('sessionId feature updatedAt messages');
    res.json({ chats });
  } catch (error) { next(error); }
});

export default router;

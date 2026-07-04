import { Router } from 'express';
import { chat, getChatHistory } from '../controllers/chat.controller';
import { requireAuth } from '../middleware/auth';
import { aiRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', requireAuth, aiRateLimiter, chat);
router.get('/history/:sessionId', requireAuth, getChatHistory);

export default router;

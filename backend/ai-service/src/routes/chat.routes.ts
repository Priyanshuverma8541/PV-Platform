import { Router } from 'express';
import { chat, getChatHistory } from '../controllers/chat.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', requireAuth, aiRateLimiter, chat);
router.get('/history/:sessionId', requireAuth, getChatHistory);

export default router;

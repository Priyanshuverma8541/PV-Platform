import { Router } from 'express';
import { generateProposal, generateEmail } from '../controllers/proposal.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { aiRateLimiter, strictRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', requireAuth, strictRateLimiter, generateProposal);
router.post('/email', requireAuth, aiRateLimiter, generateEmail);

export default router;

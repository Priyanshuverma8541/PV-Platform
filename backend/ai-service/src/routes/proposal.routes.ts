import { Router } from 'express';
import { generateProposal, generateEmail } from '../controllers/proposal.controller';
import { requireAuth } from '../middleware/auth';
import { aiRateLimiter, strictRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', requireAuth, strictRateLimiter, generateProposal);
router.post('/email', requireAuth, aiRateLimiter, generateEmail);

export default router;

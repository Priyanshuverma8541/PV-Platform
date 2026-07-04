import { Router } from 'express';
import { generateResume, generateCoverLetter } from '../controllers/resume.controller';
import { requireAuth } from '../middleware/auth';
import { strictRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/generate', requireAuth, strictRateLimiter, generateResume);
router.post('/cover-letter', requireAuth, strictRateLimiter, generateCoverLetter);

export default router;

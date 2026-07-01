import { Router } from 'express';
import { generateResume, generateCoverLetter } from '../controllers/resume.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { strictRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/generate', requireAuth, strictRateLimiter, generateResume);
router.post('/cover-letter', requireAuth, strictRateLimiter, generateCoverLetter);

export default router;

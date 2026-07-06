import { Router } from 'express';
import { generateResume, improveResume } from '../controllers/resume.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Resume routes
router.post('/generate', generateResume);
router.post('/improve', improveResume);

export default router;
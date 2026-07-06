import { Router } from 'express';
import { chat } from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Chat routes
router.post('/', chat);

export default router;
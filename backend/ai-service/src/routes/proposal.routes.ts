import { Router } from 'express';
import { generateProposal, improveProposal } from '../controllers/proposal.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Proposal routes
router.post('/generate', generateProposal);
router.post('/improve', improveProposal);

export default router;
import { Router } from 'express';
import authRoutes from './auth.js';
import oauthRoutes from './oauth.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/oauth', oauthRoutes);

export default router;

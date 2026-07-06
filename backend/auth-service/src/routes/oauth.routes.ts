import { Router } from 'express';
import { env } from '@pv/config';
import { logger } from '@pv/utils';

const router = Router();

// @desc    GitHub OAuth callback
// @route   GET /api/auth/oauth/github/callback
// @access  Public
router.get('/github/callback', (req: any, res: any) => {
  // TODO: Implement GitHub OAuth
  logger.info('GitHub OAuth callback received');
  res.json({
    success: true,
    message: 'GitHub OAuth - To be implemented',
  });
});

// @desc    Google OAuth callback
// @route   GET /api/auth/oauth/google/callback
// @access  Public
router.get('/google/callback', (req: any, res: any) => {
  // TODO: Implement Google OAuth
  logger.info('Google OAuth callback received');
  res.json({
    success: true,
    message: 'Google OAuth - To be implemented',
  });
});

export default router;
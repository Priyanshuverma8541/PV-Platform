import { Router } from 'express';
import { githubAuth, googleAuth, oauthCallback } from '../controllers/oauth.controller.js';

const router = Router();

router.get('/github', githubAuth);
router.get('/github/callback', oauthCallback);
router.get('/google', googleAuth);
router.get('/google/callback', oauthCallback);

export default router;

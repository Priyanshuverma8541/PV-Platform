import { Router } from 'express';
import { mediaController } from '../controllers/media.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);
router.use(rateLimiter);

// POST /api/media/upload - Upload a file
router.post('/upload', mediaController.uploadFile.bind(mediaController));

// GET /api/media/files - Get user's files
router.get('/files', mediaController.getFiles.bind(mediaController));

// GET /api/media/files/:id - Get a specific file
router.get('/files/:id', mediaController.getFile.bind(mediaController));

// DELETE /api/media/files/:id - Delete a file
router.delete('/files/:id', mediaController.deleteFile.bind(mediaController));

export default router;
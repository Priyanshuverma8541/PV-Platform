import { Router } from 'express';
import { uploadMedia, getMedia, getMediaById, deleteMedia } from '../controllers/media.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Media routes
router.post('/upload', uploadMedia);
router.get('/', getMedia);
router.get('/:id', getMediaById);
router.delete('/:id', deleteMedia);

export default router;
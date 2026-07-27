import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { uploadSinglePhoto } from '../middleware/uploadMiddleware';
import { uploadMedia, deleteMedia } from '../controllers/mediaController';

const router = express.Router();

router.post('/upload', protect, authorize('ADMIN'), uploadSinglePhoto, uploadMedia);
router.delete('/', protect, authorize('ADMIN'), deleteMedia);
router.delete('/:publicId', protect, authorize('ADMIN'), deleteMedia);

export default router;

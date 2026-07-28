import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { uploadSinglePhoto, uploadMultiplePhotos } from '../middleware/uploadMiddleware';
import {
  uploadMedia,
  uploadMultipleMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
  deleteMultipleMedia,
} from '../controllers/mediaController';

const router = express.Router();

// Public Read Routes
router.get('/', getAllMedia);
router.get('/:id', getMediaById);

// Admin Protected Write/CRUD Routes
router.post('/upload', protect, authorize('ADMIN'), uploadSinglePhoto, uploadMedia);
router.post('/upload-multiple', protect, authorize('ADMIN'), uploadMultiplePhotos, uploadMultipleMedia);
router.put('/:id', protect, authorize('ADMIN'), uploadSinglePhoto, updateMedia);
router.post('/delete-multiple', protect, authorize('ADMIN'), deleteMultipleMedia);
router.delete('/bulk', protect, authorize('ADMIN'), deleteMultipleMedia);
router.delete('/:publicId', protect, authorize('ADMIN'), deleteMedia);
router.delete('/', protect, authorize('ADMIN'), deleteMedia);

export default router;

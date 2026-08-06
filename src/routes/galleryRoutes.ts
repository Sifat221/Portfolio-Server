import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { uploadSinglePhoto } from '../middleware/uploadMiddleware';
import {
  getGallery,
  getGalleryById,
  createGallery,
  updateGallery,
  deleteGallery,
} from '../controllers/galleryController';

const router = express.Router();

// Public Read Routes
router.get('/', getGallery);
router.get('/:id', getGalleryById);

// Admin Protected Write/CRUD Routes
router.post('/', protect, authorize('ADMIN'), uploadSinglePhoto, createGallery);
router.put('/:id', protect, authorize('ADMIN'), uploadSinglePhoto, updateGallery);
router.delete('/:id', protect, authorize('ADMIN'), deleteGallery);

export default router;

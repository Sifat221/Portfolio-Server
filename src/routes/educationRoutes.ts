import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { getEducation, createEducation, deleteEducation } from '../controllers/educationController';
import galleryRoutes from './galleryRoutes';

const router = express.Router();

// Mount gallery routes under /api/education/gallery
router.use('/gallery', galleryRoutes);

router.get('/', getEducation);
router.post('/', protect, authorize('ADMIN'), createEducation);
router.delete('/:id', protect, authorize('ADMIN'), deleteEducation);

export default router;


import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { getTestimonials, createTestimonial, deleteTestimonial } from '../controllers/testimonialsController';

const router = express.Router();

router.get('/', getTestimonials);
router.post('/', protect, authorize('ADMIN'), createTestimonial);
router.delete('/:id', protect, authorize('ADMIN'), deleteTestimonial);

export default router;

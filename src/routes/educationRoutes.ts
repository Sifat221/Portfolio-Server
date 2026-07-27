import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { getEducation, createEducation, deleteEducation } from '../controllers/educationController';

const router = express.Router();

router.get('/', getEducation);
router.post('/', protect, authorize('ADMIN'), createEducation);
router.delete('/:id', protect, authorize('ADMIN'), deleteEducation);

export default router;

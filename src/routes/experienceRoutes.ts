import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { getExperience, createExperience } from '../controllers/experienceController';

const router = express.Router();

router.get('/', getExperience);
router.post('/', protect, authorize('ADMIN'), createExperience);

export default router;

import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { getAchievements, createAchievement, deleteAchievement } from '../controllers/achievementsController';

const router = express.Router();

router.get('/', getAchievements);
router.post('/', protect, authorize('ADMIN'), createAchievement);
router.delete('/:id', protect, authorize('ADMIN'), deleteAchievement);

export default router;

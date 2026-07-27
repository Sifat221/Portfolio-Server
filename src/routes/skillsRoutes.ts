import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { getSkills, createSkill, deleteSkill } from '../controllers/skillsController';

const router = express.Router();

router.get('/', getSkills);
router.post('/', protect, authorize('ADMIN'), createSkill);
router.delete('/:id', protect, authorize('ADMIN'), deleteSkill);

export default router;

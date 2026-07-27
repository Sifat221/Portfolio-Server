import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { uploadSinglePhoto } from '../middleware/uploadMiddleware';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectsController';

const router = express.Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', protect, authorize('ADMIN'), uploadSinglePhoto, createProject);
router.put('/:id', protect, authorize('ADMIN'), uploadSinglePhoto, updateProject);
router.delete('/:id', protect, authorize('ADMIN'), deleteProject);

export default router;

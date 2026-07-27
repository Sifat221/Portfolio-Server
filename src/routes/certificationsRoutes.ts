import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { getCertifications, createCertification, deleteCertification } from '../controllers/certificationsController';

const router = express.Router();

router.get('/', getCertifications);
router.post('/', protect, authorize('ADMIN'), createCertification);
router.delete('/:id', protect, authorize('ADMIN'), deleteCertification);

export default router;

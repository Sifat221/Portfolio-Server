import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { getCertifications, createCertification, updateCertification, deleteCertification } from '../controllers/certificationsController';

const router = express.Router();

router.get('/', getCertifications);
router.post('/', protect, authorize('ADMIN'), createCertification);
router.put('/:id', protect, authorize('ADMIN'), updateCertification);
router.delete('/:id', protect, authorize('ADMIN'), deleteCertification);

export default router;

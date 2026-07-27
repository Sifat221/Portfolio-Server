import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { submitContactForm, getContactMessages } from '../controllers/contactController';

const router = express.Router();

router.post('/', submitContactForm);
router.get('/', protect, authorize('ADMIN'), getContactMessages);

export default router;

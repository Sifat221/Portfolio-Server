import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { login, logout, getMe, getDashboardStats } from '../controllers/authController';

const router = express.Router();

// Public Routes
router.post('/login', login);
router.get('/me', protect, getMe);

// Protected Admin Routes (Dashboard & Logout)
router.post('/logout', protect, authorize('ADMIN'), logout);
router.get('/dashboard', protect, authorize('ADMIN'), getDashboardStats);

export default router;

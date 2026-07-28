import { Request, Response } from 'express';
import catchAsync from '../shared/catchAsync';
import sendResponse from '../shared/sendResponse';
import { AuthenticatedRequest } from '../types';
import { loginUser, logoutUser, getAuthProfile, getDashboardAnalytics } from '../services/authService';

// @desc    Admin / User Login
// @route   POST /api/auth/login
// @access  Public
export const login = catchAsync(async (req: Request, res: Response) => {
  const roleHeader = req.headers['x-role'] as string | undefined;
  const result = await loginUser(req.body, roleHeader);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully',
    data: result,
  });
});

// @desc    Admin Logout
// @route   POST /api/auth/logout
// @access  Private / Admin
export const logout = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await logoutUser(req.user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
  });
});

// @desc    Get Current User Profile & Role Permissions
// @route   GET /api/auth/me
// @access  Public / Private
export const getMe = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const profile = await getAuthProfile(req.user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: profile,
  });
});

// @desc    Get Admin Dashboard Stats & Metrics
// @route   GET /api/auth/dashboard
// @access  Private / Admin
export const getDashboardStats = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const analytics = await getDashboardAnalytics();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin dashboard analytics loaded successfully',
    data: analytics,
  });
});

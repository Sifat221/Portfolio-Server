import { Request, Response } from 'express';
import catchAsync from '../shared/catchAsync';
import sendResponse from '../shared/sendResponse';
import { fetchAllExperience, createNewExperience } from '../services/experienceService';

// @desc    Get experience history
// @route   GET /api/experience
// @access  Public
export const getExperience = catchAsync(async (req: Request, res: Response) => {
  const result = await fetchAllExperience();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    ...(result.isFallback ? { isFallback: true } : {}),
    count: result.count,
    data: result.data,
  });
});

// @desc    Create experience record
// @route   POST /api/experience
// @access  Private / Admin
export const createExperience = catchAsync(async (req: Request, res: Response) => {
  const experience = await createNewExperience(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    data: experience,
  });
});

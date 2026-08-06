import { Request, Response } from 'express';
import catchAsync from '../shared/catchAsync';
import sendResponse from '../shared/sendResponse';
import { fetchPersonalProfile, updatePersonalProfileService } from '../services/personalService';

// @desc    Get personal & profile summary
// @route   GET /api/personal
// @access  Public
export const getPersonalProfile = catchAsync(async (req: Request, res: Response) => {
  const data = await fetchPersonalProfile();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    data,
  });
});

// @desc    Update personal & profile summary
// @route   PUT /api/personal
// @access  Public / Admin
export const updatePersonalProfile = catchAsync(async (req: Request, res: Response) => {
  const data = await updatePersonalProfileService(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Personal profile updated successfully',
    data,
  });
});

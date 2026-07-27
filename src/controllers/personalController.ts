import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import personalData from '../../data/personal.json';

// @desc    Get personal & profile summary
// @route   GET /api/personal
// @access  Public
export const getPersonalProfile = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: personalData,
  });
});

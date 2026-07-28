import { Request, Response } from 'express';
import catchAsync from '../shared/catchAsync';
import sendResponse from '../shared/sendResponse';
import { fetchAllSkills, createNewSkill, deleteExistingSkill } from '../services/skillsService';

// @desc    Get skills
// @route   GET /api/skills
// @access  Public
export const getSkills = catchAsync(async (req: Request, res: Response) => {
  const result = await fetchAllSkills();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    ...(result.isFallback ? { isFallback: true } : {}),
    count: result.count,
    data: result.data,
  });
});

// @desc    Create a skill
// @route   POST /api/skills
// @access  Private / Admin
export const createSkill = catchAsync(async (req: Request, res: Response) => {
  const skill = await createNewSkill(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    data: skill,
  });
});

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private / Admin
export const deleteSkill = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteExistingSkill(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
  });
});

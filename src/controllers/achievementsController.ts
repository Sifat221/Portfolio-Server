import { Request, Response } from 'express';
import catchAsync from '../shared/catchAsync';
import sendResponse from '../shared/sendResponse';
import { fetchAllAchievements, createNewAchievement, deleteExistingAchievement } from '../services/achievementsService';

export const getAchievements = catchAsync(async (req: Request, res: Response) => {
  const result = await fetchAllAchievements();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    ...(result.isFallback ? { isFallback: true } : {}),
    count: result.count,
    data: result.data,
  });
});

export const createAchievement = catchAsync(async (req: Request, res: Response) => {
  const achievement = await createNewAchievement(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    data: achievement,
  });
});

export const deleteAchievement = catchAsync(async (req: Request, res: Response) => {
  const result = await deleteExistingAchievement(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
  });
});

import { Request, Response } from 'express';
import catchAsync from '../shared/catchAsync';
import sendResponse from '../shared/sendResponse';
import { fetchAllEducation, createNewEducation, deleteExistingEducation } from '../services/educationService';

export const getEducation = catchAsync(async (req: Request, res: Response) => {
  const result = await fetchAllEducation();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    ...(result.isFallback ? { isFallback: true } : {}),
    count: result.count,
    data: result.data,
  });
});

export const createEducation = catchAsync(async (req: Request, res: Response) => {
  const education = await createNewEducation(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    data: education,
  });
});

export const deleteEducation = catchAsync(async (req: Request, res: Response) => {
  const result = await deleteExistingEducation(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
  });
});

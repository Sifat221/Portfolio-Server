import { Request, Response } from 'express';
import catchAsync from '../shared/catchAsync';
import sendResponse from '../shared/sendResponse';
import { fetchAllCertifications, createNewCertification, deleteExistingCertification } from '../services/certificationsService';

export const getCertifications = catchAsync(async (req: Request, res: Response) => {
  const result = await fetchAllCertifications();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    ...(result.isFallback ? { isFallback: true } : {}),
    count: result.count,
    data: result.data,
  });
});

export const createCertification = catchAsync(async (req: Request, res: Response) => {
  const cert = await createNewCertification(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    data: cert,
  });
});

export const deleteCertification = catchAsync(async (req: Request, res: Response) => {
  const result = await deleteExistingCertification(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
  });
});

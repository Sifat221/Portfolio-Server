import { Request, Response } from 'express';
import catchAsync from '../shared/catchAsync';
import sendResponse from '../shared/sendResponse';
import { fetchAllTestimonials, createNewTestimonial, deleteExistingTestimonial } from '../services/testimonialsService';

export const getTestimonials = catchAsync(async (req: Request, res: Response) => {
  const result = await fetchAllTestimonials();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    ...(result.isFallback ? { isFallback: true } : {}),
    count: result.count,
    data: result.data,
  });
});

export const createTestimonial = catchAsync(async (req: Request, res: Response) => {
  const testimonial = await createNewTestimonial(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    data: testimonial,
  });
});

export const deleteTestimonial = catchAsync(async (req: Request, res: Response) => {
  const result = await deleteExistingTestimonial(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
  });
});

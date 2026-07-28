import { Request, Response } from 'express';
import catchAsync from '../shared/catchAsync';
import sendResponse from '../shared/sendResponse';
import { saveContactMessage, fetchAllContactMessages } from '../services/contactService';

export const submitContactForm = catchAsync(async (req: Request, res: Response) => {
  const savedMessage = await saveContactMessage(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Thank you for reaching out! Your message has been received.',
    data: savedMessage,
  });
});

export const getContactMessages = catchAsync(async (req: Request, res: Response) => {
  const result = await fetchAllContactMessages();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    count: result.count,
    data: result.data,
  });
});

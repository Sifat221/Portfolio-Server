import { Request, Response, NextFunction } from 'express';
import ApiError from '../errors/ApiError';

export interface IGenericErrorMessage {
  path: string | number;
  message: string;
}

// 404 Not Found handler middleware
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new ApiError(404, `API Route Not Found - ${req.originalUrl}`);
  next(error);
};

// Global Error Handler Middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorMessages: IGenericErrorMessage[] = [];

  // Check if error is an instance of custom ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errorMessages = err.message ? [{ path: '', message: err.message }] : [];
  } 
  // Handle Prisma Known Request Errors
  else if (err.code && typeof err.code === 'string' && err.code.startsWith('P')) {
    if (err.code === 'P2002') {
      statusCode = 409;
      message = 'Duplicate entry violation: Record with provided unique field already exists';
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Record not found in database';
    } else {
      statusCode = 400;
      message = `Database Request Error (${err.code})`;
    }
    errorMessages = [{ path: '', message: err.message || message }];
  } 
  // Handle Prisma Validation Errors
  else if (err.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Database Validation Error: Invalid payload or fields passed';
    errorMessages = [{ path: '', message: err.message }];
  }
  // Handle Standard Error objects
  else if (err instanceof Error) {
    statusCode = (err as any).statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
    message = err.message;
    errorMessages = err.message ? [{ path: '', message: err.message }] : [];
  }

  // Console logging for debugging in non-test environment
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Global Error Handler] [${req.method}] ${req.originalUrl} - ${statusCode}: ${message}`, {
      error: err,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: process.env.NODE_ENV === 'production' ? undefined : err?.stack,
  });
};

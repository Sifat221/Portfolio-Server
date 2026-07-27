import { Request, Response, NextFunction } from 'express';

// Middleware for handling 404 Not Found routes
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler Middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  console.error(`[Global Error Handler] ${err.message}`, {
    path: req.originalUrl,
    method: req.method,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

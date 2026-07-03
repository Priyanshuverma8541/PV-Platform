import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from 'pv-core';
import logger from '../utils/logger.js';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
): void {
  const requestId = (req as any).requestId || 'unknown';
  const statusCode = (error as any).statusCode || 500;

  logger.error('Unhandled error', {
    requestId,
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method
  });

  const response: ApiResponse<any> = {
    success: false,
    message: error.message || 'Internal server error',
    errors: [error.message],
    timestamp: new Date(),
    requestId
  };

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    response.message = 'Internal server error';
    response.errors = undefined;
  }

  res.status(statusCode).json(response);
}
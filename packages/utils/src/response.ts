import { Response } from 'express';

export const successResponse = <T>(res: Response, data: T, message?: string, statusCode = 200): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res: Response, message: string, statusCode = 500, error?: any): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error instanceof Error ? error.message : error,
  });
};

export const paginatedResponse = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
): Response => {
  return res.status(200).json({
    success: true,
    message,
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
};
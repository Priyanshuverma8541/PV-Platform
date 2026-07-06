import { Request, Response, NextFunction } from 'express';
import { logger } from '@pv/utils';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Gateway error:', err);
  
  const statusCode = err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
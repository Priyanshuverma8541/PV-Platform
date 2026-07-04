import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/index';
import { ApiResponse } from 'pv-core';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response<ApiResponse<any>>, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No token provided',
        errors: ['Authorization token is required'],
        timestamp: new Date(),
        requestId: (req as any).requestId
      } as ApiResponse<any>);
      return;
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string; email: string };
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        errors: ['Token verification failed'],
        timestamp: new Date(),
        requestId: (req as any).requestId
      } as ApiResponse<any>);
      return;
    }
  } catch (error) {
    next(error);
  }
}
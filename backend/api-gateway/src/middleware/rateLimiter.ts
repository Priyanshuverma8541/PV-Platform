import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from 'pv-core';
import { logger } from '../utils/logger';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  skipSuccessfulRequests?: boolean;
}

const rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map();

export function rateLimiter(req: Request, res: Response<ApiResponse<any>>, next: NextFunction): void {
  try {
    const config: RateLimitConfig = {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      skipSuccessfulRequests: false
    };

    const clientId = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const key = `${clientId}:${req.path}`;

    const limitData = rateLimitStore.get(key);

    if (!limitData || now > limitData.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      next();
      return;
    }

    limitData.count++;

    if (limitData.count > config.max) {
      logger.warn('Rate limit exceeded', {
        clientId,
        path: req.path,
        count: limitData.count
      });

      res.status(429).json({
        success: false,
        message: 'Too many requests',
        errors: [`Rate limit exceeded. Please try again in ${Math.ceil((limitData.resetTime - now) / 1000)} seconds`],
        timestamp: new Date(),
        requestId: (req as any).requestId
      } as ApiResponse<any>);
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // Every 5 minutes
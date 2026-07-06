import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@pv/utils';
import { env } from '@pv/config';
import { User } from '@pv/database';
import { logger } from '@pv/utils';

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

// Authenticate JWT token
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    try {
      const decoded = verifyToken(token, env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      // Add user to request
      req.user = {
        userId: user._id.toString(),
        email: user.email,
      };

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};
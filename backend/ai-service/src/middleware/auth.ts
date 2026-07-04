import type { Response, NextFunction } from 'express';
import { verifyToken, extractBearerToken } from '@pv/auth';
import env from '../config/env';
import type { AuthenticatedRequest} from '../types/index';

/**
 * Reuses @pv/auth's verifyToken â€” the exact same logic as auth-service.
 * This is what "log in once, recognised everywhere" looks like in code.
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ message: 'Authorization header missing or invalid.' });
  }

  const result = verifyToken(token, env.JWT_SECRET);
  if (!result.valid || !result.payload) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }

  req.user = { userId: result.payload.userId, email: result.payload.email || '' };
  next();
}


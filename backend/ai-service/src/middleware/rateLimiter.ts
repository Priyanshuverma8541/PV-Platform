import rateLimit from 'express-rate-limit';
import env from '../config/env';

/**
 * Global rate limiter — applied to all AI endpoints.
 * Later you can make this per-plan (Free/Pro/Enterprise)
 * by reading the user's plan from the DB in the keyGenerator.
 */
export const aiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, // default: 60 seconds
  max: env.RATE_LIMIT_MAX,            // default: 20 requests/min
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit per user, not per IP — more fair for shared IPs
    const userId = (req as { user?: { userId: string } }).user?.userId;
    return userId ?? req.ip ?? 'unknown';
  },
  message: {
    message: 'Too many AI requests. Please wait before trying again.',
    retryAfter: Math.ceil(env.RATE_LIMIT_WINDOW_MS / 1000),
  },
});

/** Stricter limiter for expensive operations (buildhub, resume generation) */
export const strictRateLimiter = rateLimit({
  windowMs: 60_000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const userId = (req as { user?: { userId: string } }).user?.userId;
    return userId ?? req.ip ?? 'unknown';
  },
  message: { message: 'Rate limit reached for this feature. Max 5 requests per minute.' },
});

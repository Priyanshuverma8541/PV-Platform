import jwt from 'jsonwebtoken';

export interface AuthTokenPayload {
  userId: string;
  email?: string;
  iat?: number;
  exp?: number;
}

export interface TokenVerificationResult {
  valid: boolean;
  payload?: AuthTokenPayload;
  error?: string;
}

export function extractBearerToken(authorizationHeader?: string): string | null {
  if (!authorizationHeader) return null;
  const [scheme, token] = authorizationHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token;
}

export function verifyToken(token: string, secret: string): TokenVerificationResult {
  try {
    const decoded = jwt.verify(token, secret) as AuthTokenPayload;
    return { valid: true, payload: decoded };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid token',
    };
  }
}

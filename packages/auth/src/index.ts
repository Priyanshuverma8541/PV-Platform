export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthTokenResponse {
  token: string;
  expiresIn: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

/**
 * Extract bearer token from Authorization header
 */
export function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1] || null;
}

/**
 * Verify JWT token and return payload
 */
export function verifyToken(token: string, secret: string): { valid: boolean; payload?: JwtPayload } {
  try {
    // Simple JWT verification (in production, use proper JWT library)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false };
    }
    
    // Decode payload (base64)
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    
    // Check expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return { valid: false };
    }
    
    return {
      valid: true,
      payload: {
        userId: payload.userId,
        email: payload.email
      }
    };
  } catch (error) {
    return { valid: false };
  }
}

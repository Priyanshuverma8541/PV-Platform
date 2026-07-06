import jwt from 'jsonwebtoken';

export const generateToken = (payload: { userId: string }, secret: string, expiresIn: string): string => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string): { userId: string } => {
  return jwt.verify(token, secret) as { userId: string };
};
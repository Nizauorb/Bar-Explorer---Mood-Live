import jwt, { SignOptions } from 'jsonwebtoken';
import { AuthPayload } from '../types';

export const generateToken = (payload: Omit<AuthPayload, 'token'>): string => {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string): AuthPayload => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

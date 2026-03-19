import jwt from 'jsonwebtoken';
import { User } from '../models/sequelize/User';
import { Request } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export class JWTService {
  static generateToken(user: User): string {
    return jwt.sign(
      { 
        userId: user.id,
        email: user.email 
      },
      JWT_SECRET,
      { 
        expiresIn: '7d',
        issuer: 'bar-explorer'
      }
    );
  }

  static verifyToken(token: string): { userId: string; email: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      return {
        userId: decoded.userId,
        email: decoded.email
      };
    } catch (error) {
      return null;
    }
  }

  static extractTokenFromHeader(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}
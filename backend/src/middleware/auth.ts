import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { User } from '../models';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    const decoded = verifyToken(token);
    
    // Mode démo : utiliser l'utilisateur démo directement
    const demoUser = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
      created_at: new Date(),
      updated_at: new Date()
    };

    req.user = demoUser;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      // Mode démo : utiliser l'utilisateur démo directement
      const demoUser = {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      req.user = demoUser;
    }
    
    next();
  } catch (error) {
    // En cas d'erreur, on continue sans authentification
    next();
  }
};

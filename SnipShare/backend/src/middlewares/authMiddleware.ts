// authMiddleware.ts - Vérification des tokens JWT
import { Request, Response, NextFunction } from 'express';
import * as jwt from "jsonwebtoken";
import { JwtPayload } from '../types/types';

export interface RequestWithUser extends Request {
  user?: JwtPayload;
}


export const verifierToken = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Non authentifié - Token manquant'
      });
      return;
    }

    const secret = process.env.JWT_SECRET || 'votre_secret_jwt_super_securise_123';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token invalide ou expiré'
    });
  }
};


export const verifierTokenOptional = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies.token;
    
    if (token) {
      const secret = process.env.JWT_SECRET || 'votre_secret_jwt_super_securise_123';
      const decoded = jwt.verify(token, secret) as JwtPayload;
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    next();
  }
};


export const genererToken = (userId: number, email: string): string => {
  const secret = process.env.JWT_SECRET || 'votre_secret_jwt_super_securise_123';
  const payload: JwtPayload = { userId, email };
  
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};